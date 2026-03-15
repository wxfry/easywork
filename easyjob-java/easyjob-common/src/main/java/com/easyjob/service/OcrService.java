package com.easyjob.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.File;

@Service
public class OcrService {

    private final Tesseract tesseract;

    public OcrService() {
        tesseract = new Tesseract();
        // 设置 Tesseract OCR 引擎的数据路径
        tesseract.setDatapath("tessdata");
        // 设置识别语言
        tesseract.setLanguage("chi_sim");
    }

    public String extractText(File imageFile) {
        try {
            // 执行 OCR 并获取文本结果
            ImageIO.scanForPlugins();
            String result = tesseract.doOCR(imageFile);
//            System.out.println(result);
            return result;
        } catch (TesseractException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
