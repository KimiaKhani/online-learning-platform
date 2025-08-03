from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import redis

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost/platform"


engine = create_engine(SQLALCHEMY_DATABASE_URL)

Base = declarative_base()

sessionlocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

RDS_HOST = "localhost"
# RDS_HOST = "127.0.0.1"
RDS_PORT = "6379"
RDS_PASSWORD = "123456"

rds = redis.Redis(host=RDS_HOST, port=RDS_PORT)


def get_db():
    session = sessionlocal()
    try:
        yield session
    finally:
        session.close()
