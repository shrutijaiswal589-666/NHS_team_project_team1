from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

# Import database models from database.py
from .database import engine, Base, get_db, RTTData, GPData

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NHS Dashboard API",
    description="Backend API for the NHS Capstone Project",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the NHS Dashboard API!"}

@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "API is running smoothly!",
        "version": "1.0.0"
    }

@app.get("/api/db-stats")
def get_db_stats(db: Session = Depends(get_db)):
    try:
        rtt_count = db.query(RTTData).count()
        gp_count = db.query(GPData).count()
        return {
            "status": "success",
            "rtt_rows": rtt_count,
            "gp_rows": gp_count,
            "message": "Successfully connected to Neon PostgreSQL!"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }

@app.get("/api/wait-times/{provider_code}")
def get_wait_times_by_provider(provider_code: str, db: Session = Depends(get_db)):
    results = db.query(RTTData).filter(RTTData.provider_org_code == provider_code.upper()).all()
    
    if not results:
        raise HTTPException(status_code=404, detail="Provider not found or no data available.")
        
    formatted_data = []
    for row in results:
        formatted_data.append({
            "treatment_function": row.treatment_function_name,
            "total_waiting": row.total_all,
            "average_wait_weeks": round(row.estimated_average_wait_time, 1)
        })
        
    return {
        "provider": provider_code.upper(),
        "provider_name": results[0].provider_org_name, 
        "data": formatted_data
    }

def get_cutoff_period(months: int) -> str:
    # We hardcode the anchor because we know the GP data ends in April 2026.
    anchor_year = 2026
    anchor_month = 4
    
    target_month = anchor_month - (months - 1)
    target_year = anchor_year
    
    while target_month <= 0:
        target_month += 12
        target_year -= 1
        
    return f"{target_year}-{target_month:02d}"

@app.get("/api/gp-kpis")
def get_gp_kpis(months: int = 12, db: Session = Depends(get_db)):
    cutoff = get_cutoff_period(months)
    prev_cutoff = get_cutoff_period(months * 2)

    # Current Period
    total_appts = db.query(func.sum(GPData.count)).filter(GPData.period >= cutoff).scalar() or 0
    dna_count = db.query(func.sum(GPData.count)).filter(GPData.period >= cutoff, GPData.appointment_status == 'DNA').scalar() or 0
    f2f_count = db.query(func.sum(GPData.count)).filter(GPData.period >= cutoff, GPData.appointment_mode == 'Face-to-Face').scalar() or 0
    
    dna_rate = round((dna_count / total_appts) * 100, 2) if total_appts > 0 else 0
    f2f_rate = round((f2f_count / total_appts) * 100, 2) if total_appts > 0 else 0

    # Previous Period (for trend calculation)
    prev_total = db.query(func.sum(GPData.count)).filter(GPData.period >= prev_cutoff, GPData.period < cutoff).scalar() or 0
    prev_dna = db.query(func.sum(GPData.count)).filter(GPData.period >= prev_cutoff, GPData.period < cutoff, GPData.appointment_status == 'DNA').scalar() or 0
    prev_f2f = db.query(func.sum(GPData.count)).filter(GPData.period >= prev_cutoff, GPData.period < cutoff, GPData.appointment_mode == 'Face-to-Face').scalar() or 0
    
    prev_dna_rate = (prev_dna / prev_total) * 100 if prev_total > 0 else 0
    prev_f2f_rate = (prev_f2f / prev_total) * 100 if prev_total > 0 else 0

    trend_total = round(((total_appts - prev_total) / prev_total) * 100, 1) if prev_total > 0 else 0.0
    trend_dna = round(dna_rate - prev_dna_rate, 1)
    trend_f2f = round(f2f_rate - prev_f2f_rate, 1)
    
    return {
        "total_appointments": total_appts,
        "dna_rate_percent": dna_rate,
        "f2f_rate_percent": f2f_rate,
        "trend_total": trend_total,
        "trend_dna": trend_dna,
        "trend_f2f": trend_f2f
    }

@app.get("/api/gp-modes")
def get_gp_appointment_modes(months: int = 12, db: Session = Depends(get_db)):
    cutoff = get_cutoff_period(months)

    results = db.query(
        GPData.appointment_mode, 
        func.sum(GPData.count).label('total')
    ).filter(GPData.period >= cutoff).group_by(GPData.appointment_mode).all()
    
    formatted_data = [{"mode": r[0], "count": r[1]} for r in results]
    formatted_data.sort(key=lambda x: x["count"], reverse=True)
    return formatted_data

@app.get("/api/gp-regions")
def get_gp_regions(months: int = 12, search: str = "", db: Session = Depends(get_db)):
    print(f"🛑 BACKEND TRIGGERED: Searching for '{search}' over the last {months} months!")
    
    cutoff = get_cutoff_period(months)

    query = db.query(
        GPData.org_name, 
        GPData.appointment_status,
        func.sum(GPData.count).label('total')
    ).filter(GPData.period >= cutoff)
    
    if search:
        query = query.filter(GPData.org_name.ilike(f"%{search}%"))

    results = query.group_by(GPData.org_name, GPData.appointment_status).all()
    
    regions_data = {}
    for org_name, status, total_count in results:
        if not org_name: 
            continue
            
        if org_name not in regions_data:
            regions_data[org_name] = {"total": 0, "dna": 0}
            
        regions_data[org_name]["total"] += total_count
        if status == 'DNA':
            regions_data[org_name]["dna"] += total_count

    formatted_regions = []
    for region_name, metrics in regions_data.items():
        total = metrics["total"]
        dna = metrics["dna"]
        dna_rate = round((dna / total) * 100, 2) if total > 0 else 0
        
        if dna_rate > 8.0:
            status_label = "Critical"
            status_color = "red"
        elif dna_rate > 5.0:
            status_label = "Warning"
            status_color = "yellow"
        else:
            status_label = "On Track"
            status_color = "green"

        formatted_regions.append({
            "region_name": region_name,
            "total_appointments": total,
            "dna_rate": dna_rate,
            "status_label": status_label,
            "status_color": status_color
        })
        
    formatted_regions.sort(key=lambda x: x["total_appointments"], reverse=True)
    return formatted_regions[:10]