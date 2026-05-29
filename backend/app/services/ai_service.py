import json
import logging
from typing import List, Optional

import google.generativeai as genai
from pydantic import BaseModel, Field

from app.core.config import settings

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


class ClassificationResponse(BaseModel):
    category: str = Field(
        description="One of: Marksheet, Resume, Certificate, Notes, Assignment, Circular, Research Paper, Project Report, Unknown"
    )


class SummaryResponse(BaseModel):
    short_summary: str
    detailed_summary: str
    bullet_points: List[str]


class DeadlineResponse(BaseModel):
    title: str
    extracted_date: str
    confidence_score: float


class StudyNotesResponse(BaseModel):
    exam_notes: str
    revision_notes: str
    key_concepts: str


class AIService:

    @staticmethod
    def _truncate_text(text: str, max_chars: int = 15000) -> str:
        return text[:max_chars]

    @staticmethod
    def _clean_json_response(response_text: str):
        cleaned = (
            response_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )
        return json.loads(cleaned)

    @staticmethod
    def classify_document(text: str) -> str:
        try:
            prompt = f"""
Classify this document into ONE category:

Marksheet
Resume
Certificate
Notes
Assignment
Circular
Research Paper
Project Report
Unknown

Document:

{text[:3000]}

Return only the category name.
"""

            response = model.generate_content(prompt)

            category = response.text.strip()

            valid = [
                "Marksheet",
                "Resume",
                "Certificate",
                "Notes",
                "Assignment",
                "Circular",
                "Research Paper",
                "Project Report",
                "Unknown"
            ]

            if category not in valid:
                return "Unknown"

            return category

        except Exception as e:
            logger.error(f"Classification failed: {e}")
            return "Unknown"

    @staticmethod
    def generate_summary(text: str) -> Optional[SummaryResponse]:

        try:
            text = AIService._truncate_text(text)

            prompt = f"""
Summarize this document.

Return ONLY valid JSON.

{{
    "short_summary": "",
    "detailed_summary": "",
    "bullet_points": []
}}

Document:

{text}
"""

            response = model.generate_content(prompt)

            print("========== GEMINI SUMMARY ==========")
            print(response.text)
            print("====================================")

            data = AIService._clean_json_response(response.text)

            return SummaryResponse(**data)

        except Exception as e:
            logger.error(f"Summary failed: {e}")
            return None

    @staticmethod
    def generate_tags(text: str) -> List[str]:

        try:

            prompt = f"""
Generate 5-10 tags for this document.

Return JSON:

{{
    "tags": []
}}

{text[:5000]}
"""

            response = model.generate_content(prompt)

            data = AIService._clean_json_response(response.text)

            return data.get("tags", [])

        except Exception as e:
            logger.error(f"Tags failed: {e}")
            return []

    @staticmethod
    def extract_deadlines(text: str) -> List[DeadlineResponse]:

        try:

            prompt = f"""
Extract deadlines from the document.

Return JSON:

{{
    "deadlines": [
        {{
            "title": "",
            "extracted_date": "",
            "confidence_score": 0.0
        }}
    ]
}}

{text}
"""

            response = model.generate_content(prompt)

            data = AIService._clean_json_response(response.text)

            return [
                DeadlineResponse(**item)
                for item in data.get("deadlines", [])
            ]

        except Exception as e:
            logger.error(f"Deadline extraction failed: {e}")
            return []

    @staticmethod
    def generate_study_notes(text: str) -> Optional[StudyNotesResponse]:

        try:

            text = AIService._truncate_text(text)

            prompt = f"""
Create study notes.

Return JSON:

{{
    "exam_notes": "",
    "revision_notes": "",
    "key_concepts": ""
}}

{text}
"""

            response = model.generate_content(prompt)

            data = AIService._clean_json_response(response.text)

            return StudyNotesResponse(**data)

        except Exception as e:
            logger.error(f"Study Notes failed: {e}")
            return None
