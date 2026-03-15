package com.easyjob.service.impl;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.easyjob.entity.constants.Constants;
import com.easyjob.entity.dto.AppUserLoginDto;
import com.easyjob.entity.dto.StatisticsDataDto;
import com.easyjob.entity.dto.StatisticsDataWeekDto;
import com.easyjob.entity.po.*;
import com.easyjob.entity.query.AppTextQuestionQuery;
import com.easyjob.entity.query.ExamQuestionItemQuery;
import com.easyjob.exception.BusinessException;
import com.easyjob.mappers.*;
import com.easyjob.service.AppCommentService;
import com.easyjob.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.BitFieldSubCommands;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class AppCommentServiceImpl implements AppCommentService {

    @Resource
    private AppCommentMapper appCommentMapper;
    @Resource
    private JWTUtil<AppUserLoginDto> jwtUtil;
    @Autowired
    private ExamQuestionMapper examQuestionMapper;
    @Autowired
    private AppExamQuestionMapper appExamQuestionMapper;
    @Autowired
    private ExamQuestionItemMapper examQuestionItemMapper;

    // 注入 RedisTemplate
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private AppUserInfoServiceImpl appUserInfoService;
    @Autowired
    private AppTextMapper appTextMapper;
    @Autowired
    private AppExamMapper appExamMapper;

    @Override
    public String getScore(String userId) {
        return this.appCommentMapper.getScore(userId);
    }

    @Override
    public List<ExamQuestion> userCF(String userId) {
        try {
            List<UserRelate> relateList = appCommentMapper.listRelate();
            List<ExamQuestion> questionList = examQuestionMapper.selectQuestionList();
            List<ExamQuestion> itemList = userCfComment(userId, relateList, questionList);
            if (itemList.size() == 0) {
                throw new Exception("获取失败");
            } else {
                /**
                 * 考题问题ID
                 */
                List<String> questionIdList = itemList.stream().map(item -> item.getQuestionId().toString())
                        .collect(Collectors.toList());
                /**
                 * 查询考题选项
                 */
                ExamQuestionItemQuery examQuestionItemQuery = new ExamQuestionItemQuery();
                examQuestionItemQuery.setQuestionIdList(questionIdList);
                List<ExamQuestionItem> examQuestionItemList = examQuestionItemMapper.selectList(examQuestionItemQuery);

                Map<Integer, List<ExamQuestionItem>> temExamItemMap = examQuestionItemList.stream()
                        .collect(Collectors.groupingBy(item -> item.getQuestionId()));

                for (ExamQuestion item : itemList) {
                    // 问题选项
                    List<ExamQuestionItem> questionItemList = temExamItemMap.get(item.getQuestionId());
                    item.setQuestionItemList(questionItemList);
                    item.setStatus(0);
                }
                return itemList;
            }
//            return new ResponseVO.success("获取成功");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("获取失败");
        }
    }

    @Override
    public List<ExamQuestion> getQuestionById(Integer questionId) {

        List<ExamQuestion> appQuestion = appCommentMapper.selectCommendQuestion(questionId);

        /**
         * 查询考题选项
         */
        ExamQuestionItemQuery examQuestionItemQuery = new ExamQuestionItemQuery();
        examQuestionItemQuery.setQuestionId(questionId);
        List<ExamQuestionItem> examQuestionItemList = examQuestionItemMapper.selectList(examQuestionItemQuery);

        Map<Integer, List<ExamQuestionItem>> temExamItemMap = examQuestionItemList.stream()
                .collect(Collectors.groupingBy(item -> item.getQuestionId()));

        for (ExamQuestion item : appQuestion) {
            List<ExamQuestionItem> questionItemList = temExamItemMap.get(questionId);
            item.setQuestionItemList(questionItemList);
        }

        return appQuestion;
    }

    /**
     * 通过计算皮尔森指数找出最邻近邻居
     *
     * @param key
     * @param map
     * @param type
     * @return
     */
    public Map<String, Double> computeNeighbor(String key, Map<String, List<UserRelate>> map, int type) {
        if (map == null || map.isEmpty() || !map.containsKey(key)) {
            // 如果 map 为空或不包含 key，直接返回空结果
            return new HashMap<>();
        }

        Map<String, Double> disMap = new HashMap<>();
        List<UserRelate> userItems = map.get(key);

        if (userItems == null || userItems.isEmpty()) {
            // 如果当前用户没有关联数据，直接返回空结果
            return new HashMap<>();
        }

        map.forEach((k, v) -> {
            // 排除当前用户
            if (!k.equals(key) && v != null && !v.isEmpty()) {
                // 计算关系系数
                double coefficient = relateDist(v, userItems, type);
                if (Double.isNaN(coefficient) || Double.isInfinite(coefficient)) {
                    // 如果系数异常，跳过该用户
                    return;
                }
                // 计算关系距离
                double distance = Math.abs(coefficient);
                disMap.put(k, distance);
            }
        });

        return disMap;
    }

    /**
     * 构建矩阵
     *
     * @param xList
     * @param yList
     * @param type
     * @return
     */

    private double relateDist(List<UserRelate> xList, List<UserRelate> yList, int type) {
//        List<Integer> xs = Lists.newArrayList();
//        List<Integer> ys = Lists.newArrayList();
        List<Integer> xs = new ArrayList<>();
        List<Integer> ys = new ArrayList<>();
        xList.forEach(x -> {
            yList.forEach(y -> {
                if (type == 0) {
                    if (Objects.equals(x.getQuestionId(), y.getQuestionId())) {
                        xs.add(x.getTimes());
                        ys.add(y.getTimes());
                    }
                } else {
                    if (Objects.equals(x.getUserId(), y.getUserId())) {
                        xs.add(x.getTimes());
                        ys.add(y.getTimes());
                    }
                }
            });
        });
        return getRelate(xs, ys);
    }

    /**
     * 计算皮尔森指数
     *
     * @param xs
     * @param ys
     * @return
     */
    public double getRelate(List<Integer> xs, List<Integer> ys) {
        int n = xs.size();
        // 至少有两个元素
        if (n < 2) {
            return 0D;
        }
        double Ex = xs.stream().mapToDouble(x -> x).sum();
        double Ey = ys.stream().mapToDouble(y -> y).sum();
        double Ex2 = xs.stream().mapToDouble(x -> Math.pow(x, 2)).sum();
        double Ey2 = ys.stream().mapToDouble(y -> Math.pow(y, 2)).sum();
        double Exy = IntStream.range(0, n).mapToDouble(i -> xs.get(i) * ys.get(i)).sum();
        double numerator = Exy - Ex * Ey / n;
        double denominator = Math.sqrt((Ex2 - Math.pow(Ex, 2) / n) * (Ey2 - Math.pow(Ey, 2) / n));
        if (denominator == 0) {
            return 0D;
        }
        return numerator / denominator;
    }

    /**
     * 将关系表按用户进行分组
     *
     * @param userId
     * @param relateList
     * @param questionList
     * @return
     */
    public List<ExamQuestion> userCfComment(String userId, List<UserRelate> relateList, List<ExamQuestion> questionList) {
        List<Integer> recommentdations = UserCFComment(userId, relateList);
        return questionList.stream().filter(e -> recommentdations.contains(e.getQuestionId())).collect(Collectors.toList());
    }

    public List<Integer> UserCFComment(String userId, List<UserRelate> relateList) {
        // 按用户分组
        Map<String, List<UserRelate>> userMap = relateList.stream().collect(Collectors.groupingBy(UserRelate::getUserId));
        // 获取其他用户与当前用户的关系值
        Map<String, Double> userDisMap = computeNeighbor(userId, userMap, 0);
        //获取关系最近的用户
        double maxValue = Collections.max(userDisMap.values());
        Set<String> userIds = userDisMap.entrySet().stream().filter(e -> e.getValue() == maxValue).map(Map.Entry::getKey).collect(Collectors.toSet());
        //取关系最近的用户
        String nearestUserId = userIds.stream().findAny().orElse(null);
        if (nearestUserId == null) {
            return Collections.emptyList();
        }
        //最近邻用户书籍列表
        List<Integer> neighborItems = userMap.get(nearestUserId).stream().map(UserRelate::getQuestionId).collect(Collectors.toList());
        //指定用户书籍列表
        List<Integer> userItems = userMap.get(userId).stream().map(UserRelate::getQuestionId).collect(Collectors.toList());
        //找到最近邻看过，但是该用户没看过的书籍
        neighborItems.removeAll(userItems);
        return neighborItems;
    }


    /**
     * 用户签到
     *
     * @param token
     * @param dateStr
     * @return
     */
    @Override
    public int doSign(String token, String dateStr) {
        // 获取登录用户信息
        AppUserInfo userInfo = loadSignInUserInfo(token);
        // 获取日期
        Date date = getDate(dateStr);
        appCommentMapper.updateSign(userInfo.getUserId(), date);
//        Date currentDate = new Date();
        // 获取日期对应的天数，多少号( 从 0 开始，0就代表1号)
        int offset = DateUtil.dayOfMonth(date) - 1;
        // 构建 Key user:sign:5:yyyyMM
        String signKey = buildSignKey(userInfo.getUserId(), date);
        // 查看是否已签到
        boolean isSigned = redisTemplate.opsForValue().getBit(signKey, offset);
//        AssertUtil.isTrue(isSigned, "当前日期已完成签到，无需再签");
        // 如果已经签到，抛出异常
        if (isSigned) {
            return 0;
        }
        // 签到
        redisTemplate.opsForValue().setBit(signKey, offset, true);
        appCommentMapper.updateScore(userInfo.getUserId());
//        return 1;
        // 统计连续签到的次数
        int count = getContinuousSignCount(userInfo.getUserId(), date);
        return count;
    }

    /**
     * 统计连续签到的次数
     *
     * @param userId
     * @param date
     * @return
     */
    private int getContinuousSignCount(String userId, Date date) {
        // 获取日期对应的天数，多少号，假设是 30
        int dayOfMonth = DateUtil.dayOfMonth(date);
        // 构建 Key
        String signKey = buildSignKey(userId, date);
        // bitfield user:sign:5:202212 u30 0
        BitFieldSubCommands bitFieldSubCommands = BitFieldSubCommands.create()
                .get(BitFieldSubCommands.BitFieldType.unsigned(dayOfMonth))
                .valueAt(0);
        List<Long> list = redisTemplate.opsForValue().bitField(signKey, bitFieldSubCommands);
        if (list == null || list.isEmpty()) {
            return 0;
        }
        int signCount = 0;
        long v = list.get(0) == null ? 0 : list.get(0);
        // i 表示位移操作次数
        for (int i = dayOfMonth; i > 0; i--) {
            // 右移再左移，如果等于自己说明最低位是 0，表示未签到
            if (v >> 1 << 1 == v) {
                // 低位 0 且非当天说明连续签到中断了
                if (i != dayOfMonth) {
                    break;
                }
            } else {
                signCount++;
            }
            // 右移一位并重新赋值，相当于把最低位丢弃一位
            v >>= 1;
        }
        appCommentMapper.updateAmount(userId, signCount);
        return signCount;
    }

    /**
     * 获取连续签到次数
     */
    @Override
    public int getSignCount(String userId) {
        int count = appCommentMapper.selectAmount(userId);
        return count;
    }

    /**
     * 构建 Key -- user:sign:5:yyyyMM
     *
     * @param userId
     * @param date
     * @return
     */
    private String buildSignKey(String userId, Date date) {
        return String.format("user:sign:%s:%s", userId,
                DateUtil.format(date, "yyyyMM"));
    }

    /**
     * 获取日期
     *
     * @param dateStr
     * @return
     */
    private Date getDate(String dateStr) {
        if (StrUtil.isBlank(dateStr)) {
            return new Date();
        }
        try {
            return DateUtil.parseDate(dateStr);
        } catch (Exception e) {
            throw new BusinessException("请传入yyyy-MM-dd的日期格式");
        }
    }

    /**
     * 获取登录用户信息
     *
     * @param token
     * @return
     */
    private AppUserInfo loadSignInUserInfo(String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
        String userId = userLoginDto.getUserId();
        AppUserInfo userInfo = appUserInfoService.getAppUserInfoByUserId(userId);
        return userInfo;
    }

    protected AppUserLoginDto getAppUserLoginfoFromToken(String token) {
        AppUserLoginDto loginDto = jwtUtil.getTokenData(Constants.JWT_KEY_LOGIN_TOKEN, token, AppUserLoginDto.class);
        return loginDto;
    }

    /**
     * 获取当月用户签到详情
     */
    public Map<String, Boolean> getSignDetail(String token, String dateStr) {
        // 获取登录用户信息
        AppUserInfo userInfo = loadSignInUserInfo(token);
        // 获取日期
        Date date = getDate(dateStr);
        // 构建 Key
        String signKey = buildSignKey(userInfo.getUserId(), date);
        // 构建一个自动排序的 Map
        Map<String, Boolean> signInfo = new TreeMap<>();
        // 获取某月的总天数（考虑闰年）
        int dayOfMonth = DateUtil.lengthOfMonth(DateUtil.month(date) + 1,
                DateUtil.isLeapYear(DateUtil.dayOfYear(date)));
        // bitfield user:sign:5:202011 u30 0
        BitFieldSubCommands bitFieldSubCommands = BitFieldSubCommands.create()
                .get(BitFieldSubCommands.BitFieldType.unsigned(dayOfMonth))
                .valueAt(0);
        List<Long> list = redisTemplate.opsForValue().bitField(signKey, bitFieldSubCommands);
        if (list == null || list.isEmpty()) {
            return signInfo;
        }
        long v = list.get(0) == null ? 0 : list.get(0);
        // 从低位到高位进行遍历，为 0 表示未签到，为 1 表示已签到
        for (int i = dayOfMonth; i > 0; i--) {
            /*
                签到：  yyyy-MM-01 true
                未签到：yyyy-MM-01 false
             */
            LocalDateTime localDateTime = LocalDateTimeUtil.of(date).withDayOfMonth(i);
            boolean flag = v >> 1 << 1 != v;
            signInfo.put(DateUtil.format(localDateTime, "yyyy-MM-dd"), flag);
            v >>= 1;
        }
        return signInfo;
    }

    /**
     * 获取用户练习数据
     */
    @Override
    public StatisticsDataWeekDto getTextData(String userId) {
        List<String> days = getDays();


        StatisticsDataWeekDto weekDto = new StatisticsDataWeekDto();
        weekDto.setDateList(days);
        weekDto.setItemDataList(new ArrayList<>());

        StatisticsDataDto item1 = new StatisticsDataDto();
        item1.setListData(new ArrayList<>());
        item1.setStatisticsName("马克思主义基本原理");
        weekDto.getItemDataList().add(item1);

        StatisticsDataDto item2 = new StatisticsDataDto();
        item2.setListData(new ArrayList<>());
        item2.setStatisticsName("毛泽东思想和中国特色社会主义理论体系概论");
        weekDto.getItemDataList().add(item2);

        StatisticsDataDto item3 = new StatisticsDataDto();
        item3.setListData(new ArrayList<>());
        item3.setStatisticsName("习近平新时代中国特色社会主义思想给概论");
        weekDto.getItemDataList().add(item3);

        StatisticsDataDto item4 = new StatisticsDataDto();
        item4.setListData(new ArrayList<>());
        item4.setStatisticsName("中国近现代史纲要");
        weekDto.getItemDataList().add(item4);

        StatisticsDataDto item5 = new StatisticsDataDto();
        item5.setListData(new ArrayList<>());
        item5.setStatisticsName("思想道德与法治");
        weekDto.getItemDataList().add(item5);

        for (String date : days) {
            AppTextQuestionQuery appTextQuestionQuery1 = new AppTextQuestionQuery();
            appTextQuestionQuery1.setUserId(userId);
            appTextQuestionQuery1.setKnowledgePoint("马克思主义基本原理");
            appTextQuestionQuery1.setPostTime(date);
            item1.getListData().add(appTextMapper.selectData(appTextQuestionQuery1));

            AppTextQuestionQuery appTextQuestionQuery2 = new AppTextQuestionQuery();
            appTextQuestionQuery2.setUserId(userId);
            appTextQuestionQuery2.setKnowledgePoint("毛泽东思想和中国特色社会主义理论体系概论");
            appTextQuestionQuery2.setPostTime(date);
            item2.getListData().add(appTextMapper.selectData(appTextQuestionQuery2));

            AppTextQuestionQuery appTextQuestionQuery3 = new AppTextQuestionQuery();
            appTextQuestionQuery3.setUserId(userId);
            appTextQuestionQuery3.setKnowledgePoint("习近平新时代中国特色社会主义思想给概论");
            appTextQuestionQuery3.setPostTime(date);
            item3.getListData().add(appTextMapper.selectData(appTextQuestionQuery3));

            AppTextQuestionQuery appTextQuestionQuery4 = new AppTextQuestionQuery();
            appTextQuestionQuery4.setUserId(userId);
            appTextQuestionQuery4.setKnowledgePoint("中国近现代史纲要");
            appTextQuestionQuery4.setPostTime(date);
            item4.getListData().add(appTextMapper.selectData(appTextQuestionQuery4));

            AppTextQuestionQuery appTextQuestionQuery5 = new AppTextQuestionQuery();
            appTextQuestionQuery5.setUserId(userId);
            appTextQuestionQuery5.setKnowledgePoint("思想道德与法治");
            appTextQuestionQuery5.setPostTime(date);
            item5.getListData().add(appTextMapper.selectData(appTextQuestionQuery5));
        }
        return weekDto;
    }

    /**
     * 获取过去7天的日期
     */
    private List<String> getDays() {
        Date startDate = com.easyjob.utils.DateUtil.getDayAgo(7);
        Date preDate = com.easyjob.utils.DateUtil.getDayAgo(1);
        List<String> days = com.easyjob.utils.DateUtil.getBetweenDate(startDate, preDate);
        return days;
    }


    /**
     * 构建用户-试题题目矩阵B
     */
    @Override
    public Map<Integer, Map<String, Integer>> buildUserQuestionMatrix() {
        // 获取所有用户的答题记录
        List<AppTextQuestion> allAnswers = appTextMapper.selectAllTextList(null);

        // 构建用户-试题题目矩阵B
        Map<Integer, Map<String, Integer>> userQuestionMatrix = new HashMap<>();

        // 按 id 降序排序答题记录，确保最新的答题记录排在最前
        allAnswers.sort(Comparator.comparing(AppTextQuestion::getId).reversed());

        // 按 question_id 和 user_id 分组，并取第一次答题结果（即最新的答题结果）
        Map<String, AppTextQuestion> latestAnswers = new HashMap<>();
        for (AppTextQuestion answer : allAnswers) {
            String key = answer.getQuestionId() + "-" + answer.getUserId();
            latestAnswers.put(key, answer);
        }

        // 构建矩阵
        for (AppTextQuestion answer : latestAnswers.values()) {
            int questionId = answer.getQuestionId();
            String userId = answer.getUserId();
            int answerResult = answer.getAnswerResult();

            userQuestionMatrix.computeIfAbsent(questionId, k -> new HashMap<>()).put(userId, answerResult);
        }

        // 打印矩阵
        System.out.println("用户-试题题目矩阵");
        printUserQuestionMatrix(userQuestionMatrix);

        return userQuestionMatrix;
    }

    /**
     * 构建试题-知识点矩阵B
     */
    @Override
    public Map<Integer, Map<String, Integer>> buildQuestionKnowledgeMatrix() {
        // 获取所有试题
        List<ExamQuestion> examQuestions = examQuestionMapper.selectAllQuestions();

        // 获取所有知识点
        Set<String> allKnowledgePoints = new HashSet<>();
        for (ExamQuestion question : examQuestions) {
            if (question.getKnowledgePoints() != null) {
                String[] knowledgePoints = question.getKnowledgePoints().split(",");
                allKnowledgePoints.addAll(Arrays.asList(knowledgePoints));
            }
        }

        // 构建知识点到索引的映射
        Map<String, Integer> knowledgePointIndexMap = new HashMap<>();
        int index = 0;
        for (String knowledgePoint : allKnowledgePoints) {
            knowledgePointIndexMap.put(knowledgePoint, index++);
        }

        // 构建试题-知识点矩阵
        Map<Integer, Map<String, Integer>> questionKnowledgeMatrix = new HashMap<>();
        for (ExamQuestion question : examQuestions) {
            Map<String, Integer> knowledgePointMap = new HashMap<>();
            if (question.getKnowledgePoints() != null) {
                String[] knowledgePoints = question.getKnowledgePoints().split(",");
                for (String knowledgePoint : knowledgePoints) {
                    knowledgePointMap.put(knowledgePoint, 1);
                }
            }
            // 填充未包含的知识点为0
            for (String knowledgePoint : allKnowledgePoints) {
                if (!knowledgePointMap.containsKey(knowledgePoint)) {
                    knowledgePointMap.put(knowledgePoint, 0);
                }
            }
            questionKnowledgeMatrix.put(question.getQuestionId(), knowledgePointMap);
        }

        // 打印矩阵
        System.out.println("试题知识点矩阵");
        printUserQuestionMatrix(questionKnowledgeMatrix);

        return questionKnowledgeMatrix;
    }

    /**
     * 构建用户-知识点矩阵C
     */
    @Override
    public Map<String, Map<String, Double>> buildUserKnowledgeMatrix() {
        // 获取用户-试题题目矩阵B
        Map<Integer, Map<String, Integer>> userQuestionMatrix = buildUserQuestionMatrix();
        // 获取试题-知识点矩阵A
        Map<Integer, Map<String, Integer>> questionKnowledgeMatrix = buildQuestionKnowledgeMatrix();

        // 构建用户-知识点矩阵C
        Map<String, Map<String, Double>> userKnowledgeMatrix = new HashMap<>();

        for (Map.Entry<Integer, Map<String, Integer>> entry : userQuestionMatrix.entrySet()) {
            Integer questionId = entry.getKey();
            Map<String, Integer> userAnswers = entry.getValue();

            // 获取该试题对应的知识点
            Map<String, Integer> knowledgePoints = questionKnowledgeMatrix.get(questionId);

            if (knowledgePoints != null) {
                for (Map.Entry<String, Integer> userEntry : userAnswers.entrySet()) {
                    String userId = userEntry.getKey();
                    Integer answerResult = userEntry.getValue();

                    for (Map.Entry<String, Integer> knowledgeEntry : knowledgePoints.entrySet()) {
                        String knowledgePoint = knowledgeEntry.getKey();
                        Integer isRelated = knowledgeEntry.getValue();

                        if (isRelated == 1) {
                            userKnowledgeMatrix.computeIfAbsent(userId, k -> new HashMap<>())
                                    .merge(knowledgePoint, answerResult == 1 ? 1.0 : 0.0, Double::sum);
                            userKnowledgeMatrix.get(userId).put(knowledgePoint + "_total",
                                    userKnowledgeMatrix.get(userId).getOrDefault(knowledgePoint + "_total", 0.0) + 1);
                        }
                    }
                }
            }
        }

        System.out.println("用户-知识点矩阵");
        printUserKnowledgeMatrix(userKnowledgeMatrix);

        // 计算每个用户的知识点掌握概率
        for (Map.Entry<String, Map<String, Double>> entry : userKnowledgeMatrix.entrySet()) {
            String userId = entry.getKey();
            Map<String, Double> knowledgeScores = entry.getValue();

            List<String> keysToRemove = new ArrayList<>();
            Map<String, Double> updates = new HashMap<>();

            for (Map.Entry<String, Double> knowledgeEntry : knowledgeScores.entrySet()) {
                String knowledgePoint = knowledgeEntry.getKey();
                if (!knowledgePoint.endsWith("_total")) {
                    double correctCount = knowledgeEntry.getValue();
                    double totalCount = knowledgeScores.getOrDefault(knowledgePoint + "_total", 0.0);
                    double masteryProbability = totalCount == 0 ? 0.0 : correctCount / totalCount;

                    // 记录需要更新的值
                    updates.put(knowledgePoint, masteryProbability);

                    // 记录需要移除的 "_total" 键
                    String totalKey = knowledgePoint + "_total";
                    if (knowledgeScores.containsKey(totalKey)) {
                        keysToRemove.add(totalKey);
                    }
                }
            }

            // 统一应用更新
            updates.forEach(knowledgeScores::put);

            // 统一移除不需要的键
            keysToRemove.forEach(knowledgeScores::remove);
        }

        // 打印矩阵
        System.out.println("用户-知识点掌握程度");
        printUserKnowledgeMatrix(userKnowledgeMatrix);

        return userKnowledgeMatrix;
    }

    /**
     * 构建指定用户的知识点掌握程度矩阵
     */
    @Override
    public Map<String, Double> buildUserKnowledgeMatrix(String userId) {
        // 获取用户-试题题目矩阵B
        Map<Integer, Map<String, Integer>> userQuestionMatrix = buildUserQuestionMatrix();
        // 获取试题-知识点矩阵A
        Map<Integer, Map<String, Integer>> questionKnowledgeMatrix = buildQuestionKnowledgeMatrix();

        // 构建指定用户的知识点掌握程度矩阵
        Map<String, Double> userKnowledgeMap = new HashMap<>();

        for (Map.Entry<Integer, Map<String, Integer>> entry : userQuestionMatrix.entrySet()) {
            Integer questionId = entry.getKey();
            Map<String, Integer> userAnswers = entry.getValue();

            // 获取该试题对应的知识点
            Map<String, Integer> knowledgePoints = questionKnowledgeMatrix.get(questionId);

            if (knowledgePoints != null && userAnswers.containsKey(userId)) {
                Integer answerResult = userAnswers.get(userId);

                for (Map.Entry<String, Integer> knowledgeEntry : knowledgePoints.entrySet()) {
                    String knowledgePoint = knowledgeEntry.getKey();
                    Integer isRelated = knowledgeEntry.getValue();

                    if (isRelated == 1) {
                        userKnowledgeMap.merge(knowledgePoint, answerResult == 1 ? 1.0 : 0.0, Double::sum);
                        userKnowledgeMap.put(knowledgePoint + "_total",
                                userKnowledgeMap.getOrDefault(knowledgePoint + "_total", 0.0) + 1);
                    }
                }
            }
        }

        if (userKnowledgeMap.isEmpty()) {
            throw new BusinessException("请先去做分类练习，再来练习推荐题目吧！");
        }

        // 收集需要删除的键
        Set<String> keysToRemove = new HashSet<>();
        for (Map.Entry<String, Double> entry : userKnowledgeMap.entrySet()) {
            String knowledgePoint = entry.getKey();
            if (!knowledgePoint.endsWith("_total")) {
                double correctCount = entry.getValue();
                double totalCount = userKnowledgeMap.getOrDefault(knowledgePoint + "_total", 0.0);
                double masteryProbability = totalCount == 0 ? 0.0 : correctCount / totalCount;
                userKnowledgeMap.put(knowledgePoint, masteryProbability);

                // 记录需要删除的键
                keysToRemove.add(knowledgePoint + "_total");
            }
        }

// 统一删除
        for (String key : keysToRemove) {
            userKnowledgeMap.remove(key);
        }

        // 打印知识点掌握程度矩阵（新增）
        System.out.println("每个用户对知识点掌握程度矩阵");
        printUserKnowledgeMatrix(Collections.singletonMap(userId, userKnowledgeMap));

        return userKnowledgeMap;

    }

    /**
     * 根据当前用户的知识点掌握情况，找到与其学习水平相近的用户
     */
    @Override
    public List<Map.Entry<String, Double>> calculateTopNUserSimilarity(String userId) {
        // 获取用户知识点掌握程度矩阵
        Map<String, Double> userKnowledgeMatrix = buildUserKnowledgeMatrix(userId);

        // 获取所有用户的知识点掌握程度矩阵
        Map<String, Map<String, Double>> allUserKnowledgeMatrices = buildUserKnowledgeMatrix();

        // 计算当前用户与其他所有用户的相关性
        List<Map.Entry<String, Double>> similarityList = new ArrayList<>();
        for (Map.Entry<String, Map<String, Double>> entry : allUserKnowledgeMatrices.entrySet()) {
            String otherUserId = entry.getKey();
            if (!otherUserId.equals(userId)) {
                double correlation = calculatePearsonCorrelation(userKnowledgeMatrix, entry.getValue());
                similarityList.add(new AbstractMap.SimpleEntry<>(otherUserId, correlation));
            }
        }

        // 根据相关系数倒序排序
        similarityList.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

        // 返回前N项结果
        return similarityList.subList(0, Math.min(1, similarityList.size()));
    }

    /**
     * 获取推荐题目
     */
    @Override
    public List<ExamQuestion> getCommendQuestion(String userId) {
        // 获取当前用户的知识点掌握程度矩阵
        Map<String, Double> userKnowledgeMatrix = buildUserKnowledgeMatrix(userId);

        // 获取所有用户的知识点掌握程度矩阵
        Map<String, Map<String, Double>> allUserKnowledgeMatrices = buildUserKnowledgeMatrix();

        // 获取相似用户的列表
        List<Map.Entry<String, Double>> similarUsers = calculateTopNUserSimilarity(userId);
        System.out.println("similarUsers:" + similarUsers);

        // 记录相似用户比当前用户掌握程度高的知识点
        Map<String, Set<String>> advancedKnowledgePoints = new HashMap<>();
        for (Map.Entry<String, Double> entry : similarUsers) {
            String similarUserId = entry.getKey();
            Map<String, Double> similarUserKnowledgeMatrix = allUserKnowledgeMatrices.get(similarUserId);
            if (similarUserKnowledgeMatrix != null) {
                advancedKnowledgePoints.put(similarUserId, new HashSet<>());
                for (Map.Entry<String, Double> knowledgeEntry : similarUserKnowledgeMatrix.entrySet()) {
                    String knowledgePoint = knowledgeEntry.getKey();
                    Double similarUserScore = knowledgeEntry.getValue();
                    Double userScore = userKnowledgeMatrix.getOrDefault(knowledgePoint, 0.0);
                    if (similarUserScore > userScore) {
                        advancedKnowledgePoints.get(similarUserId).add(knowledgePoint);
                        System.out.println("similarUserId:" + similarUserId + " " + "knowledgePoint:" + knowledgePoint);
                    }
                }
            }
        }

        Set<Integer> userCorrectQuestions = new HashSet<>();
        // 获取推荐的问题
        List<AppTextQuestion> recommendedQuestions = new ArrayList<>();
        for (Map.Entry<String, Set<String>> entry : advancedKnowledgePoints.entrySet()) {
            String similarUserId = entry.getKey();
            Set<String> knowledgePoints = entry.getValue();
            for (String knowledgePoint : knowledgePoints) {
                // 根据相似用户ID和知识点获取该用户回答过的问题
                List<AppTextQuestion> userQuestions = appTextMapper.selectQuestionsByUserIdAndKnowledgePoint(similarUserId, knowledgePoint);
                recommendedQuestions.addAll(userQuestions);
                // 获取当前用户已经答对的题目 ID
                List<AppTextQuestion> currentUserAnswers = appTextMapper.selectQuestionsByUserIdAndKnowledgePoint(userId, knowledgePoint);
                for (AppTextQuestion answer : currentUserAnswers) {
                    if (answer.getAnswerResult() == 1) {
                        userCorrectQuestions.add(answer.getQuestionId());
                    }
                }
            }
        }

        // 去除当前用户已经答对的题目
        List<AppTextQuestion> filteredRecommendedQuestions = recommendedQuestions.stream()
                .filter(q -> !userCorrectQuestions.contains(q.getQuestionId()))
                .collect(Collectors.toList());

        List<String> questionIds = filteredRecommendedQuestions.stream()
                .map(AppTextQuestion::getQuestionId)
                .map(String::valueOf)
                .collect(Collectors.toList());

        // 使用 questionId 查询 examQuestion
        if (questionIds.isEmpty()) {
            throw new BusinessException("没有推荐问题，请先去练习");
        }
        List<ExamQuestion> examQuestions = examQuestionMapper.selectListByIds(questionIds);

        ExamQuestionItemQuery examQuestionItemQuery = new ExamQuestionItemQuery();
        examQuestionItemQuery.setQuestionIdList(questionIds);
        List<ExamQuestionItem> examQuestionItemList = examQuestionItemMapper.selectList(examQuestionItemQuery);

        Map<Integer, List<ExamQuestionItem>> temExamItemMap = examQuestionItemList.stream()
                .collect(Collectors.groupingBy(item -> item.getQuestionId()));

        for (ExamQuestion item : examQuestions) {
            List<ExamQuestionItem> questionItemList = temExamItemMap.get(item.getQuestionId());
            item.setQuestionItemList(questionItemList);
            item.setStatus(0);
        }

        // 去重并返回推荐的问题
        return examQuestions.stream()
                .distinct()
                .collect(Collectors.toList());
    }


    private double calculatePearsonCorrelation(Map<String, Double> user1KnowledgeMatrix, Map<String, Double> user2KnowledgeMatrix) {
        // 获取所有知识点
        Set<String> allKnowledgePoints = new HashSet<>(user1KnowledgeMatrix.keySet());
        allKnowledgePoints.addAll(user2KnowledgeMatrix.keySet());

        if (allKnowledgePoints.isEmpty()) {
            return 0.0;
        }

        // 计算 x 和 y 的平均值
        double sumX = 0.0, sumY = 0.0;
        for (String knowledgePoint : allKnowledgePoints) {
            double x = user1KnowledgeMatrix.getOrDefault(knowledgePoint, 0.0);
            double y = user2KnowledgeMatrix.getOrDefault(knowledgePoint, 0.0);
            sumX += x;
            sumY += y;
        }
        int n = allKnowledgePoints.size();
        double meanX = sumX / n;
        double meanY = sumY / n;

        // 计算分子和分母
        double numerator = 0.0;
        double sumSquaredDiffX = 0.0;
        double sumSquaredDiffY = 0.0;
        for (String knowledgePoint : allKnowledgePoints) {
            double x = user1KnowledgeMatrix.getOrDefault(knowledgePoint, 0.0);
            double y = user2KnowledgeMatrix.getOrDefault(knowledgePoint, 0.0);
            numerator += (x - meanX) * (y - meanY);
            sumSquaredDiffX += Math.pow(x - meanX, 2);
            sumSquaredDiffY += Math.pow(y - meanY, 2);
        }
        double denominator = Math.sqrt(sumSquaredDiffX * sumSquaredDiffY);

        if (denominator == 0) {
            return 0.0;
        }

        return numerator / denominator;
    }

    /**
     * 根据token获取当前userId，在app_text_question中按照knowledgePoint的顺序查询练习的题目数量，以map格式返回
     *
     * @param token 用户token
     * @return 知识点与题目数量的map
     */
    @Override
    public Map<String, Integer> getKnowledgePointQuestionCount(String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
        String userId = userLoginDto.getUserId();

        List<String> knowledgePoints = Arrays.asList(
                "马克思主义基本原理",
                "毛泽东思想和中国特色社会主义理论体系概论",
                "习近平新时代中国特色社会主义思想概论",
                "中国近现代史纲要",
                "思想道德与法治"
        );

        Map<String, Integer> knowledgePointQuestionCountMap = new HashMap<>();
        for (String knowledgePoint : knowledgePoints) {
            AppTextQuestionQuery query = new AppTextQuestionQuery();
            query.setUserId(userId);
            query.setKnowledgePoint(knowledgePoint);
            int count = appTextMapper.selectDataByKnowledgePoint(query);
            knowledgePointQuestionCountMap.put(knowledgePoint, count);
        }

        return knowledgePointQuestionCountMap;
    }

    /**
     * 根据token获取当前userId，在app_exam中查找当前用户最后5次已完成考试的exam_id，根据exam_id查找app_exam_question中当前考试的题目正确和错误数量并以百分比形式计算正确率，以map格式返回
     *
     * @param token 用户token
     * @return 考试ID与正确率的map
     */
    @Override
    public Map<Integer, Double> getExamStatistics(String token) {
        AppUserLoginDto userLoginDto = getAppUserLoginfoFromToken(token);
        String userId = userLoginDto.getUserId();

        // 获取用户最后5次已完成考试的exam_id
        List<Integer> examIds = appExamMapper.selectLastFiveCompletedExams(userId);

        Map<Integer, Double> examStatisticsMap = new HashMap<>();
        for (Integer examId : examIds) {
            // 统计每个考试的正确和错误题目数量
            Map<String, Object> questionCountMap = appExamQuestionMapper.countCorrectAndIncorrectQuestions(examId);

            // 获取正确和错误题目的数量，并处理可能的 BigDecimal 类型
            int correctCount = convertToInt(questionCountMap.get("correct"));
            int incorrectCount = convertToInt(questionCountMap.get("incorrect"));

            int totalQuestions = correctCount + incorrectCount;

            // 计算正确率
//            double accuracyRate = totalQuestions == 0 ? 0.0 : (double) correctCount / totalQuestions * 100;
            double accuracyRate = totalQuestions == 0 ? 0.0 : (double) correctCount / totalQuestions * 100;
            accuracyRate = BigDecimal.valueOf(accuracyRate).setScale(2, RoundingMode.HALF_UP).doubleValue();

            examStatisticsMap.put(examId, accuracyRate);
        }

        return examStatisticsMap;
    }

    private int convertToInt(Object value) {
        if (value == null) {
            return 0;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        } else if (value instanceof BigDecimal) {
            return ((BigDecimal) value).intValue();
        } else {
            throw new IllegalArgumentException("Unsupported type for conversion: " + value.getClass().getName());
        }
    }

    /**
     * 辅助方法：以表格形式打印用户-知识点掌握程度矩阵（列对齐优化版）
     */
    private void printUserKnowledgeMatrix(Map<String, Map<String, Double>> matrix) {
        if (matrix.isEmpty()) {
            System.out.println("用户知识点掌握矩阵为空");
            return;
        }

        // 收集所有知识点并计算最大长度，用于对齐
        Set<String> allKnowledgePoints = new HashSet<>();
        for (Map<String, Double> userMap : matrix.values()) {
            allKnowledgePoints.addAll(userMap.keySet());
        }

        List<String> sortedKnowledgePoints = new ArrayList<>(allKnowledgePoints);
        sortedKnowledgePoints.sort(Comparator.naturalOrder());

        int maxKpLength = sortedKnowledgePoints.stream()
                .mapToInt(String::length)
                .max()
                .orElse(10);

        // 表头格式化模板（例如 "%-15s" 表示左对齐，宽度为15）
        StringBuilder headerFormat = new StringBuilder("%-15s");
        for (int i = 0; i < sortedKnowledgePoints.size(); i++) {
            headerFormat.append("%-").append(maxKpLength + 5).append("s");
        }
        String[] headerArgs = new String[sortedKnowledgePoints.size() + 1];
        headerArgs[0] = "UserId";
        for (int i = 0; i < sortedKnowledgePoints.size(); i++) {
            headerArgs[i + 1] = sortedKnowledgePoints.get(i);
        }
        System.out.println(String.format(headerFormat.toString(), (Object[]) headerArgs));

        // 每个用户的行数据
        for (Map.Entry<String, Map<String, Double>> userEntry : matrix.entrySet()) {
            String userId = userEntry.getKey();
            Map<String, Double> knowledgeMap = userEntry.getValue();

            Object[] rowArgs = new Object[sortedKnowledgePoints.size() + 1];
            rowArgs[0] = userId;

            for (int i = 0; i < sortedKnowledgePoints.size(); i++) {
                String kp = sortedKnowledgePoints.get(i);
                double score = knowledgeMap.getOrDefault(kp, 0.0);
                // 转换为百分比字符串，如 0.85 -> "85.00%"
                rowArgs[i + 1] = String.format("%.2f%%", score * 100);
            }

            StringBuilder rowFormat = new StringBuilder("%-15s");
            for (int i = 0; i < sortedKnowledgePoints.size(); i++) {
                rowFormat.append("%-").append(maxKpLength + 15).append("s");
            }

            System.out.println(String.format(rowFormat.toString(), rowArgs));
        }
    }


    /**
     * 辅助方法：以表格形式打印用户-试题题目矩阵（列对齐优化版）
     */
    private void printUserQuestionMatrix(Map<Integer, Map<String, Integer>> matrix) {
        if (matrix.isEmpty()) {
            System.out.println("用户试题题目矩阵为空");
            return;
        }

        // 收集所有用户ID
        Set<String> allUsers = new HashSet<>();
        for (Map<String, Integer> questionMap : matrix.values()) {
            allUsers.addAll(questionMap.keySet());
        }

        List<String> sortedUsers = new ArrayList<>(allUsers);
        sortedUsers.sort(Comparator.naturalOrder());

        int maxUserIdLength = sortedUsers.stream()
                .mapToInt(String::length)
                .max()
                .orElse(10);

        // 表头格式化模板
        StringBuilder headerFormat = new StringBuilder("%-15s");
        for (int i = 0; i < sortedUsers.size(); i++) {
            headerFormat.append("%-").append(maxUserIdLength + 5).append("s");
        }
        String[] headerArgs = new String[sortedUsers.size() + 1];
        headerArgs[0] = "QuestionId";
        for (int i = 0; i < sortedUsers.size(); i++) {
            headerArgs[i + 1] = sortedUsers.get(i);
        }
        System.out.println(String.format(headerFormat.toString(), (Object[]) headerArgs));

        // 每个题目的行数据
        for (Map.Entry<Integer, Map<String, Integer>> entry : matrix.entrySet()) {
            Integer questionId = entry.getKey();
            Map<String, Integer> userMap = entry.getValue();

            Object[] rowArgs = new Object[sortedUsers.size() + 1];
            rowArgs[0] = questionId;

            for (int i = 0; i < sortedUsers.size(); i++) {
                String userId = sortedUsers.get(i);
                int result = userMap.getOrDefault(userId, 0);
                rowArgs[i + 1] = result;
            }

            StringBuilder rowFormat = new StringBuilder("%-15s");
            for (int i = 0; i < sortedUsers.size(); i++) {
                rowFormat.append("%-").append(maxUserIdLength + 5).append("d");
            }

            System.out.println(String.format(rowFormat.toString(), rowArgs));
        }
    }
}
