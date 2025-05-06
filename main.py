from fastapi import FastAPI
from DB.database import Base
from DB.database import engine
from routers import router_student, router_teacher
from authentication import authentications



app = FastAPI()
app.include_router(authentications.router)
app.include_router(router_student.router)
app.include_router(router_teacher.router)



Base.metadata.create_all(engine)


@app.get("/")
def home():
    return "Hello"
