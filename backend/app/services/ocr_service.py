import os
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import re
from typing import Tuple


class OCRService:

    @staticmethod
    def sanitize_text(text: str) -> str:
        """
        Remove NUL characters and invalid control characters.
        PostgreSQL cannot store NUL (\x00) characters.
        """

        if not text:
            return ""

        # Remove NUL characters
        text = text.replace("\x00", "")

        # Remove other invalid control characters
        text = "".join(
            ch for ch in text
            if ord(ch) >= 32 or ch in "\n\r\t"
        )

        return text.strip()

    @staticmethod
    def clean_extracted_text(text: str) -> str:
        """
        Normalize extracted text.
        """

        text = OCRService.sanitize_text(text)

        text = re.sub(r" +", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)

        return text.strip()

    @staticmethod
    def extract_image_text(file_path: str) -> str:
        """
        Extract text from image files using Tesseract OCR.
        """

        try:

            image = Image.open(file_path)

            text = pytesseract.image_to_string(image)

            return OCRService.clean_extracted_text(text)

        except Exception as e:

            raise Exception(
                f"Image OCR Failed: {str(e)}"
            )

    @staticmethod
    def extract_pdf_text(file_path: str) -> Tuple[str, bool]:
        """
        Extract text directly from PDF.
        Returns:
            (extracted_text, ocr_used)
        """

        try:

            doc = fitz.open(file_path)

            full_text = ""

            for page in doc:
                page_text = page.get_text()

                if page_text:
                    full_text += page_text + "\n"

            full_text = OCRService.clean_extracted_text(
                full_text
            )

            return full_text, False

        except Exception as e:

            raise Exception(
                f"PDF Extraction Failed: {str(e)}"
            )

    @staticmethod
    def extract_document_text(
        file_path: str,
        mime_type: str
    ) -> Tuple[str, bool]:
        """
        Main entry point for document text extraction.
        """

        if not os.path.exists(file_path):

            raise FileNotFoundError(
                f"File not found: {file_path}"
            )

        if "pdf" in mime_type:

            return OCRService.extract_pdf_text(
                file_path
            )

        elif "image" in mime_type:

            return (
                OCRService.extract_image_text(
                    file_path
                ),
                True
            )

        else:

            raise ValueError(
                f"Unsupported MIME type: {mime_type}"
            )