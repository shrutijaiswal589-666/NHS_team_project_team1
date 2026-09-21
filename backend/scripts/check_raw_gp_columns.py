import pandas as pd
import os
import glob

RAW_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw"))

def check_raw_gp_columns():
    print(f"⏳ Searching for raw GP CSV files in {RAW_DIR_PATH}...")
    
    all_files = glob.glob(os.path.join(RAW_DIR_PATH, "*.csv"))
    
    if not all_files:
        print(f"❌ ERROR: No CSV files found in {RAW_DIR_PATH}")
        return

    # Filter out RTT files
    gp_files = [f for f in all_files if "rtt" not in os.path.basename(f).lower()]
    
    if not gp_files:
        print("❌ No GP CSV files found. Make sure your new GP files are in the raw folder and don't have 'rtt' in the name.")
        return

    print(f"✅ Found {len(gp_files)} GP file(s). Checking columns...\n")

    for file_path in gp_files:
        file_name = os.path.basename(file_path)
        print(f"📊 EXACT COLUMNS FOR: {file_name}")
        print("-" * 50)
        
        try:
            # Read just the first row to be blazing fast
            df = pd.read_csv(file_path, nrows=1, low_memory=False)
            
            for col in df.columns:
                print(f"'{col}'")
                
            print("\n")
        except Exception as e:
            print(f"❌ Error reading {file_name}: {e}")

if __name__ == "__main__":
    check_raw_gp_columns()