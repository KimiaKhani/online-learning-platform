from fastapi import FastAPI
from DB.database import Base
from DB.database import engine
from routers import router_student, router_teacher, router_academy, router_admin, router_language
from authentication import authentications
import logging
from fastapi.exceptions import HTTPException





app = FastAPI()
app.include_router(authentications.router)
app.include_router(router_student.router)
app.include_router(router_teacher.router)
app.include_router(router_academy.router)
app.include_router(router_admin.router)
app.include_router(router_language.router)





#.\venv\Scripts\activate   

Base.metadata.create_all(engine)


@app.get("/")
def home():
    try:
        return "HELLO"
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")