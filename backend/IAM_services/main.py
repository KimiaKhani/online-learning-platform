from fastapi import FastAPI
from DB.database import engine
from DB.models import base
from router import student
from authentication1 import authentications
from fastapi.middleware.cors import CORSMiddleware

origins = [
    '*'
]

base.metadata.create_all(engine)

app = FastAPI(openapi_prefix="/iam")
app.include_router(authentications.router)
app.include_router(student.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




