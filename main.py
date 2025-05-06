from fastapi import FastAPI
from DB.database import Base
from DB.database import engine


app = FastAPI()


Base.metadata.create_all(engine)


@app.get("/")
def home():
    return "Hello"
