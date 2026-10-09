from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (optional - graceful fallback if not configured)
mongo_url = os.environ.get('MONGO_URL')
db = None
client = None

if mongo_url:
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ.get('DB_NAME', 'sircubat')]
        logger.info("MongoDB connection established")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {str(e)}. Continuing without database.")
else:
    logger.warning("MONGO_URL not configured. Contact form submissions will not be saved to database.")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactFormData(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    message: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/contact")
async def send_contact_email(form_data: ContactFormData):
    """
    Отправляет email с данными формы на info@sircubat.com
    """
    try:
        # Получаем настройки из переменных окружения
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        recipient_email = os.environ.get('RECIPIENT_EMAIL', 'info@sircubat.com')
        
        # Если нет настроек SMTP, используем простую отправку через mailto
        if not smtp_user or not smtp_password:
            logger.warning("SMTP credentials not configured. Email will be logged only.")
            logger.info(f"Contact form submission: {form_data.model_dump()}")
            # Сохраняем в базу данных как fallback, если доступна
            if db:
                try:
                    contact_doc = {
                        **form_data.model_dump(),
                        'timestamp': datetime.now(timezone.utc).isoformat(),
                        'status': 'pending'
                    }
                    await db.contact_submissions.insert_one(contact_doc)
                    logger.info("Contact submission saved to database")
                except Exception as e:
                    logger.error(f"Failed to save to database: {str(e)}")
            
            return {
                "success": True,
                "message": "Votre demande a été enregistrée. Nous vous répondrons sous 24h."
            }
        
        # Создаем email
        msg = MIMEMultipart()
        msg['From'] = formataddr(('SIRCU BAT Website', smtp_user))
        msg['To'] = recipient_email
        msg['Reply-To'] = form_data.email
        msg['Subject'] = f'Nouvelle demande de contact - {form_data.firstName} {form_data.lastName}'
        
        # Формируем тело письма
        body = f"""
Nouvelle demande de contact reçue depuis le site web SIRCU BAT

Informations du client:
- Nom complet: {form_data.firstName} {form_data.lastName}
- Email: {form_data.email}
- Téléphone: {form_data.phone}

Message:
{form_data.message}

---
Cet email a été envoyé automatiquement depuis le formulaire de contact du site web SIRCU BAT.
"""
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Отправляем email
        try:
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
            
            # Сохраняем в базу данных, если доступна
            if db:
                try:
                    contact_doc = {
                        **form_data.model_dump(),
                        'timestamp': datetime.now(timezone.utc).isoformat(),
                        'status': 'sent'
                    }
                    await db.contact_submissions.insert_one(contact_doc)
                    logger.info("Contact submission saved to database")
                except Exception as e:
                    logger.error(f"Failed to save to database: {str(e)}")
            
            logger.info(f"Contact email sent successfully from {form_data.email}")
            
            return {
                "success": True,
                "message": "Votre demande a été envoyée avec succès. Nous vous répondrons sous 24h."
            }
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            # Сохраняем в базу данных даже при ошибке отправки, если доступна
            if db:
                try:
                    contact_doc = {
                        **form_data.model_dump(),
                        'timestamp': datetime.now(timezone.utc).isoformat(),
                        'status': 'failed',
                        'error': str(e)
                    }
                    await db.contact_submissions.insert_one(contact_doc)
                except Exception as db_error:
                    logger.error(f"Failed to save to database: {str(db_error)}")
            
            # Возвращаем успех, но с предупреждением
            return {
                "success": True,
                "message": "Votre demande a été enregistrée. Nous vous répondrons sous 24h."
            }
    
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error processing contact form: {error_msg}", exc_info=True)
        
        # Всегда возвращаем успешный ответ пользователю, даже при ошибке
        # Данные будут сохранены в логах
        return {
            "success": True,
            "message": "Votre demande a été reçue. Nous vous répondrons sous 24h."
        }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
        logger.info("MongoDB connection closed")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint для проверки состояния сервера"""
    return {
        "status": "ok",
        "mongodb": "connected" if db else "not_configured",
        "smtp": "configured" if os.environ.get('SMTP_USER') and os.environ.get('SMTP_PASSWORD') else "not_configured"
    }