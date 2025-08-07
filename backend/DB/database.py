from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import redis
import os



#SQLALCHEMY_DATABASE_URL =  "postgresql://root:MdehUvRoOiAW9wBeibrChJEt@platform:5432/postgres"
SQLALCHEMY_DATABASE_URL = "postgresql://root:W1G8N1TRa92pGViMlqWUqUPY@awesome-babbage-ctioqpint-db:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

Base = declarative_base()

sessionlocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


REDIS_URL = "redis://5acb551f82db5846f47b98d088a109836bf2a1d724d176cff80be61114361b10@redis-18687.c281.us-east-1-2.ec2.redns.redis-cloud.com:18687"
rds = redis.from_url(REDIS_URL)

def get_db():
    session = sessionlocal()
    try:
        yield session
    finally:
        session.close()


# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost/platform"


# engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Base = declarative_base()

# sessionlocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# RDS_HOST = "localhost"
# # RDS_HOST = "127.0.0.1"
# RDS_PORT = "6379"
# RDS_PASSWORD = "123456"

# rds = redis.Redis(host=RDS_HOST, port=RDS_PORT)


# def get_db():
#     session = sessionlocal()
#     try:
#         yield session
#     finally:
#         session.close()