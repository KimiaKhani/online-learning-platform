from fastapi import FastAPI
from DB.database import Base
from DB.database import engine
from routers import router_student, router_teacher
from authentication import authentications
import logging
from fastapi.exceptions import HTTPException





app = FastAPI()
app.include_router(authentications.router)
app.include_router(router_student.router)
app.include_router(router_teacher.router)


#.\venv\Scripts\activate   

Base.metadata.create_all(engine)


@app.get("/")
def home():
    try:
        return {"message": "Hello"}
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")