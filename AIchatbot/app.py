from __future__ import annotations

import logging
import os
import httpx
from typing import List, Optional, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


logger = logging.getLogger("ai_chatbot")
logging.basicConfig(level=logging.INFO)


class ChatHistoryItem(BaseModel):
    sender: str
    text: str


class ChatRequest(BaseModel):
    role: Optional[str] = Field(default=None, description="Role of the user: parent, student, etc.")
    selected_option: Optional[str] = Field(default=None, description="Original selected option from UI")
    message: str = Field(..., description="Latest user message")
    history: Optional[List[ChatHistoryItem]] = Field(default=None, description="Recent chat history")


class ChatResponse(BaseModel):
    intent: str
    reply: str


class UserInfoRequest(BaseModel):
    name: str
    phoneNumber: str
    sessionId: Optional[str] = None
    userType: Optional[str] = None


class UserInfoResponse(BaseModel):
    status: int
    message: str
    data: Optional[Dict] = None


def _is_complex(message: str) -> bool:
    text = message.lower()
    word_count = len(text.split())
    keywords = [
        "why", "how", "explain", "detail", "detailed", "step by step",
        "policy", "requirements", "scholarship", "transfer", "appeal",
        "exception", "visa", "equivalency", "calculation", "calculate",
        "derive", "proof", "long", "comprehensive"
    ]
    if word_count >= 25:
        return True
    return any(k in text for k in keywords)


def _is_in_domain(message: str) -> bool:
    text = message.lower()
    domain_keywords = [
        "lycee", "st", "saint", "alexandre", "sauli", "school", "college",
        "student", "parent", "teacher", "class", "timetable", "calendar",
        "semester", "term", "holiday", "event", "meeting", "parent-teacher",
        "fees", "tuition", "payment", "balance", "admission", "enrollment",
        "registration", "exam", "grade", "performance", "results", "library",
        "uniform", "transport", "bus", "clubs", "sports", "contact", "office",
        "principal", "headmaster", "dashboard", "babyeyi", "help", "assist",
        "when", "what", "how", "where", "why", "start", "begin", "open",
        "schedule", "time", "date", "information", "info", "question"
    ]
    # Include program-related keywords as in-domain
    domain_keywords += ["program", "programs", "course", "courses", "curriculum", "option", "tvet"]
    
    is_in_domain = any(k in text for k in domain_keywords)
    logger.info(f"Domain check for '{text}': {is_in_domain}")
    return is_in_domain


def detect_intent(message: str, role: str) -> str:
    text = message.lower()
    
    # Debug logging
    logger.info(f"Detecting intent for message: '{message}' with role: '{role}'")
    
    # If the question looks complex and not obviously mapped → escalate
    if _is_complex(text):
        logger.info("Complex question detected, escalating")
        return "complex_escalation"
    
    # Programs offered intent (role-agnostic) – check before out_of_scope
    if any(k in text for k in ["program", "programs", "course", "courses", "offer", "offered", "available"]):
        logger.info("Programs offered intent detected")
        return "programs_offered"
    
    # If out of school scope → escalate
    if not _is_in_domain(text):
        logger.info("Out of domain detected")
        return "out_of_scope"
    if role == "parent":
        if any(k in text for k in ["parent-teacher", "meeting", "conference"]):
            return "parent_meeting_schedule"
        if any(k in text for k in ["fee", "fees", "balance", "payment", "paid", "outstanding"]):
            return "parent_fee_status"
        if any(k in text for k in ["perform", "grade", "mark", "result", "progress"]):
            return "parent_academic_performance"
        if any(k in text for k in ["event", "sports", "assembly", "club"]):
            return "parent_upcoming_events"
        if any(k in text for k in ["holiday", "break", "vacation"]):
            return "parent_holidays"
        return "parent_general"

    # default to student
    if any(k in text for k in ["start", "begin", "resume", "opening", "reopen"]):
        return "student_semester_start"
    if any(k in text for k in ["fee", "fees", "balance", "owe", "outstanding", "cleared"]):
        return "student_outstanding_fees"
    if any(k in text for k in ["event", "sports", "assembly", "club"]):
        return "student_upcoming_events"
    
    # Teacher intents (check before student general)
    if role == "teacher":
        if any(k in text for k in ["start", "begin", "resume", "opening", "reopen", "semester"]):
            return "student_semester_start"
        if any(k in text for k in ["event", "meeting", "staff", "development", "conference"]):
            return "student_upcoming_events"
        if any(k in text for k in ["schedule", "timetable", "class", "teaching", "my schedule"]):
            return "teacher_schedule"
        if any(k in text for k in ["student", "performance", "grade", "progress"]):
            return "teacher_student_performance"
        return "teacher_general"
    
    return "student_general"


def generate_reply(intent: str, role: str) -> str:
    # In production, call your NLU + DB/data services here. This is a rules-based stub.
    if intent == "complex_escalation":
        return "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
    if intent == "out_of_scope":
        return "No. Agent to assit you! Please back on this chat between 2 - 3 hours"
    if intent == "programs_offered":
        return (
            "We offer the following programs: "
            "Accounting; Fashion Design (FAD); Software Development (SWD); "
            "Network and Internet Technology (NIT); Computer System and Architecture (CSA)."
        )
    if intent == "parent_meeting_schedule":
        return (
            "Your next parent-teacher meeting is scheduled for July 15th, 2025 at 2:00 PM with "
            "Mrs. Jeanvier (Mathematics teacher). You'll receive a reminder 24 hours before the meeting."
        )
    if intent == "parent_fee_status":
        return (
            "Your Joseph Ishimwe has paid 75% of this semester's fees. The remaining balance is 45,000 RWF, "
            "due by March 30th, 2025. Would you like to see payment options?"
        )
    if intent == "parent_academic_performance":
        return (
            "Your child is performing well in most subjects. Recent improvements in Science (85%) and slight "
            "attention needed in French (68%). Would you like a detailed babyeyi letter?"
        )
    if intent == "parent_upcoming_events":
        return "Upcoming events include Sports Day next Friday and a Cultural Fair on the 25th."
    if intent == "parent_holidays":
        return "The next holiday break starts on August 5th and runs for two weeks."
    if intent == "student_semester_start":
        return "The next semester starts on September 2nd. Orientation will be on September 1st."
    if intent == "student_outstanding_fees":
        return "You have an outstanding balance of 15,000 RWF for this term. Payments can be made via bank or mobile money."
    if intent == "student_upcoming_events":
        return "Student events this month: Debate Club on Tuesdays, Football tryouts on Wednesday, and Science Fair on the 20th."

    # Teacher-specific responses
    if role == "teacher":
        if intent == "student_semester_start":
            return "The next semester starts on September 2nd. Teacher orientation will be on August 30th. Please check your email for the detailed schedule."
        if intent == "student_upcoming_events":
            return "Upcoming teacher events: Staff meeting on Monday, Professional Development on Wednesday, and Parent-Teacher Conference on Friday."
        if intent == "teacher_schedule":
            return "Your teaching schedule is available in the teacher portal. You can also contact the administration office for any schedule changes."
        if intent == "teacher_student_performance":
            return "Student performance reports are updated weekly. You can access detailed analytics through the teacher dashboard."
        return "How can I help you with your teaching schedule, student performance, or school events?"

    # General fallbacks
    if role == "parent":
        return "How can I assist you regarding meetings, fees, performance, events, or holidays?"
    return "How can I help with your semester dates, fees, or events?"


async def recordUserInfo(name: str, phoneNumber: str, sessionId: Optional[str] = None, userType: Optional[str] = None) -> Dict:
    """
    Record user information to the Backend API
    """
    try:
        backend_url = os.getenv("BACKEND_URL", "http://localhost:9090")
        url = f"{backend_url}/api/v1/chat-conversation/record-user-info"
        
        payload = {
            "name": name,
            "phoneNumber": phoneNumber,
            "sessionId": sessionId,
            "userType": userType
        }
        
        logger.info(f"Recording user info: {name}, {phoneNumber}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"User info recorded successfully: {result}")
            return result
            
    except Exception as e:
        logger.error(f"Failed to record user info: {e}")
        return {
            "status": 500,
            "message": f"Failed to record user information: {str(e)}",
            "data": None
        }


def _load_overrides() -> Dict[str, Dict[str, str]]:
    overrides: Dict[str, Dict[str, str]] = {}
    try:
        overrides_path = os.path.join(os.path.dirname(__file__), "datasets", "custom_overrides.jsonl")
        if os.path.exists(overrides_path):
            with open(overrides_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        obj = json.loads(line)
                        key = (obj.get("text") or "").strip().lower()
                        if key:
                            overrides[key] = obj
                    except Exception:
                        continue
    except Exception:
        pass
    return overrides


def create_app() -> FastAPI:
    app = FastAPI(title="Lycee Saint Alexandre AI Chatbot API", version="1.0.0")

    allowed_origins_env = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000, http://127.0.0.1:3000")
    allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins + ["http://localhost", "http://127.0.0.1"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    overrides_cache = _load_overrides()

    @app.post("/record-user-info", response_model=UserInfoResponse)
    async def record_user_info(body: UserInfoRequest) -> UserInfoResponse:
        """
        Record user information (name and phone number) to the Backend
        """
        try:
            result = await recordUserInfo(
                name=body.name,
                phoneNumber=body.phoneNumber,
                sessionId=body.sessionId,
                userType=body.userType
            )
            return UserInfoResponse(**result)
        except Exception as e:
            logger.error(f"Error in record_user_info endpoint: {e}")
            return UserInfoResponse(
                status=500,
                message=f"Internal server error: {str(e)}",
                data=None
            )

    @app.post("/chat", response_model=ChatResponse)
    def chat(body: ChatRequest) -> ChatResponse:
        role_raw = (body.role or body.selected_option or "").strip().lower()
        logger.info(f"Raw role from request: '{role_raw}'")
        
        if "parent" in role_raw:
            role = "parent"
        elif "student" in role_raw or "future student" in role_raw:
            role = "student"
        elif "teacher" in role_raw:
            role = "teacher"
        else:
            # Default to student for unknown roles
            role = "student"
        
        logger.info(f"Resolved role: '{role}'")

        # Check overrides exact match first
        key = (body.message or "").strip().lower()
        if key in overrides_cache:
            override = overrides_cache[key]
            if "answer" in override and override["answer"]:
                logger.info("override_answer role=%s message=%s", role, body.message)
                return ChatResponse(intent=override.get("intent") or "override", reply=override["answer"]) 
            if "doc_url" in override and override["doc_url"]:
                # If doc_url but no answer, fallback to generic phrasing as text-only
                reply = (
                    "School information is available on the About page. "
                    "Visit the About section for details about our mission, programs, and community."
                )
                logger.info("override_doc role=%s message=%s", role, body.message)
                return ChatResponse(intent=override.get("intent") or "override", reply=reply)

        intent = detect_intent(body.message, role)
        reply = generate_reply(intent, role)
        logger.info("Final response - intent=%s role=%s message=%s reply=%s", intent, role, body.message, reply)
        return ChatResponse(intent=intent, reply=reply)

    return app


app = create_app()

# To run: uvicorn app:app --reload --host 0.0.0.0 --port 8000






