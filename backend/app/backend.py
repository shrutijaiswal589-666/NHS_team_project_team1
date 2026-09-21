import os
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env file (going up one level to the backend folder)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class RTTData(Base):
    __tablename__ = "rtt_data"
    id = Column(Integer, primary_key=True, index=True)
    period = Column(String)
    provider_org_code = Column(String)
    provider_org_name = Column(String)
    treatment_function_name = Column(String)
    total_all = Column(Integer)
    wait_under_18_weeks = Column(Float)
    wait_18_to_52_weeks = Column(Float)
    wait_over_52_weeks = Column(Float)
    estimated_average_wait_time = Column(Float)

class GPData(Base):
    __tablename__ = "gp_data"
    id = Column(Integer, primary_key=True, index=True)
    period = Column(String)
    org_code = Column(String)
    org_name = Column(String)
    appointment_mode = Column(String) 
    time_between_book_and_appt = Column(String) 
    appointment_status = Column(String) 
    count = Column(Integer)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()