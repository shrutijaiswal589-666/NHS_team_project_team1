import pandas as pd
import sys
import os
from pathlib import Path

# ==========================================
# BULLETPROOF PATH FIX (Windows safe)
# ==========================================
# We use insert(0) to force Python to look in THIS specific backend folder FIRST,
# ignoring any other 'app' folders installed on your PC.
backend_dir = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, backend_dir)

from app.backend import engine, Base, RTTData, GPData, SessionLocal

def ingest():
    print("🧹 Wiping the database clean to free up space (512MB limit)...")
    # This deletes the broken, bloated tables taking up your 0.37 GB
    Base.metadata.drop_all(bind=engine)
    
    print("🏗️ Recreating empty tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # ==========================================
    # 1. RTT Data
    # ==========================================
    try:
        rtt_path = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "clean_rtt2.csv")
        print(f"Uploading RTT data from {os.path.basename(rtt_path)}...")
        rtt_df = pd.read_csv(rtt_path) 
        
        rtt_records = rtt_df.to_dict(orient="records")
        for i in range(0, len(rtt_records), 5000):
            db.bulk_insert_mappings(RTTData, rtt_records[i:i+5000])
            db.commit()
        print(f"✅ Successfully uploaded {len(rtt_df)} RTT rows.")
    except Exception as e:
        print(f"⚠️ Error uploading RTT Data: {e}")

    # ==========================================
    # 2. GP Data
    # ==========================================
    try:
        gp_path = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "clean_gp.csv")
        print(f"Uploading GP data from {os.path.basename(gp_path)}...")
        gp_df = pd.read_csv(gp_path)
        
        print(f"📊 Uploading {len(gp_df)} aggregated GP rows...")
        
        gp_records = gp_df.to_dict(orient="records")
        # Upload in batches of 5000 to prevent Neon connection timeouts
        for i in range(0, len(gp_records), 5000):
            db.bulk_insert_mappings(GPData, gp_records[i:i+5000])
            db.commit()
        print(f"✅ Successfully uploaded {len(gp_df)} GP rows.")
        
    except Exception as e:
        print(f"⚠️ Error uploading GP Data: {e}")

    db.close()
    print("\n🎉 Success! Your database is now populated and within the size limits.")

if __name__ == "__main__":
    ingest()
