from fastapi import FastAPI
from DB.database import Base, engine, get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from DB.database import get_db, rds
from sqlalchemy.orm import Session
from routers import router_student, router_teacher, router_academy, router_admin, router_language, router_course,router_video, router_link, router_enrollment
from authentication1 import authentications
import logging
from fastapi.exceptions import HTTPException
from apscheduler.schedulers.background import BackgroundScheduler
<<<<<<< HEAD
from DB.db_course import update_course_completion_status  
from fastapi.middleware.cors import CORSMiddleware
=======
#from DB.db_course import update_course_completion_status  
from fastapi.responses import PlainTextResponse
>>>>>>> b2e9bd61595f56a1b4e32f5595927b4c65c5a612



# scheduler = BackgroundScheduler()


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # یا ["http://localhost:3000"] فقط برای دامنه فرانتت
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_admin.router)
app.include_router(authentications.router)
app.include_router(router_student.router)
app.include_router(router_teacher.router)
app.include_router(router_academy.router)
app.include_router(router_language.router)
app.include_router(router_course.router)
app.include_router(router_link.router)
app.include_router(router_video.router)
app.include_router(router_enrollment.router)

Base.metadata.create_all(engine)


# def start_scheduler(db: Session):
#     scheduler.add_job(update_course_completion_status, 'interval', minutes=60, args=[db])  
#     scheduler.start()  


# @app.on_event("startup")
# async def startup_event():
#     db = next(get_db())  
#     start_scheduler(db)  


# @app.on_event("shutdown")
# def shutdown_event():
#     scheduler.shutdown()  


@app.get("/", response_class=PlainTextResponse)
def home():
    try:
        return "Hello"
    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@app.get("/test-postgres")
def test_postgres(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "✅ PostgreSQL connection is OK"}
    except Exception as e:
        return {"status": "❌ PostgreSQL connection FAILED", "error": str(e)}


@app.get("/test-redis")
def test_redis():
    try:
        rds.set("ping", "pong")
        value = rds.get("ping")
        return {"status": "✅ Redis connection is OK", "value": value.decode()}
    except Exception as e:
        return {"status": "❌ Redis connection FAILED", "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)


#Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force 
#.\.venv\Scripts\activate    