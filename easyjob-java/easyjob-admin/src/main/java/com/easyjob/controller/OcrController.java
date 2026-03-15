package com.easyjob.controller;

import com.easyjob.entity.vo.ResponseVO;
import com.easyjob.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController("ocrController")
@RequestMapping("/ocr")
public class OcrController extends ABaseController {

    @Autowired
    private OcrService ocrService;

    @RequestMapping("/examQuestion")
    public ResponseVO extractText(MultipartFile file) {
        if (file.isEmpty()) {
            return getSuccessResponseVO("File is empty");
        }
        try {
            // 创建一个临时文件，指定文件格式为 PNG
            File tempFile = File.createTempFile("ocr-", ".png");
            tempFile.deleteOnExit();

            // 将 MultipartFile 的内容写入到临时文件中
            file.transferTo(tempFile);

            // 调用 OCR 服务提取文字
            String extractedText = ocrService.extractText(tempFile);
            return getSuccessResponseVO(extractedText);
        } catch (Exception e) {
            e.printStackTrace();
            return getServerErrorResponseVO("File conversion failed");
        }
    }
}