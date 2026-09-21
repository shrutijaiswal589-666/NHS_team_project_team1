import pandas as pd
import os
import glob

# ==========================================
# FILE PATHS
# ==========================================
RAW_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw"))
PROCESSED_FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed", "clean_gp.csv"))

def preprocess_gp():
    print(f"⏳ Searching for GP CSV files in {RAW_DIR_PATH}...")
    
    # Get all CSV files in raw directory
    all_files = glob.glob(os.path.join(RAW_DIR_PATH, "*.csv"))
    
    if not all_files:
        print(f"❌ ERROR: No CSV files found in {RAW_DIR_PATH}")
        print("Please place your raw 12-month NHS GP CSV file(s) into backend/data/raw/")
        return

    # Filter out RTT files if both exist in raw folder
    gp_files = [f for f in all_files if "rtt" not in os.path.basename(f).lower()]
    
    if not gp_files:
        print("❌ No GP CSV files found. Make sure GP filenames do not contain 'rtt'.")
        return

    print(f"✅ Found {len(gp_files)} GP file(s) to process.")

    processed_dfs = []

    for file_path in gp_files:
        file_name = os.path.basename(file_path)
        print(f"\n🔄 Processing {file_name}...")

        try:
            # 1. Exactly match the NHS columns from your check script
            cols_to_use = [
                'SUB_ICB_LOCATION_CODE', 'SUB_ICB_LOCATION_NAME', 
                'Appointment_Date', 'APPT_STATUS', 'APPT_MODE', 
                'TIME_BETWEEN_BOOK_AND_APPT', 'COUNT_OF_APPOINTMENTS'
            ]
            
            # 2. Read only these columns to save memory
            df = pd.read_csv(file_path, usecols=cols_to_use, low_memory=False)
            
            # 3. Rename them to our database standard
            df = df.rename(columns={
                'SUB_ICB_LOCATION_CODE': 'org_code',
                'SUB_ICB_LOCATION_NAME': 'org_name',
                'Appointment_Date': 'period',
                'APPT_STATUS': 'appointment_status',
                'APPT_MODE': 'appointment_mode',
                'TIME_BETWEEN_BOOK_AND_APPT': 'time_between_book_and_appt',
                'COUNT_OF_APPOINTMENTS': 'count'
            })

            # 4. Format dates into YYYY-MM period format
            df['period'] = pd.to_datetime(df['period'], errors='coerce').dt.to_period('M').astype(str)
            df['count'] = pd.to_numeric(df['count'], errors='coerce').fillna(1).astype(int)

            # 5. Aggregate (Group By) - This shrinks the data massively!
            print("   🧮 Aggregating daily rows into monthly counts...")
            df_agg = df.groupby(
                ['period', 'org_code', 'org_name', 'appointment_mode', 'time_between_book_and_appt', 'appointment_status'], 
                as_index=False
            )['count'].sum()

            processed_dfs.append(df_agg)
            print(f"   ✅ Shrunk to {len(df_agg)} aggregated monthly rows.")

        except Exception as e:
            print(f"   ❌ Error processing {file_name}: {e}")

    if processed_dfs:
        print("\n⏳ Merging all months into master GP dataset...")
        final_gp_df = pd.concat(processed_dfs, ignore_index=True)

        os.makedirs(os.path.dirname(PROCESSED_FILE_PATH), exist_ok=True)
        final_gp_df.to_csv(PROCESSED_FILE_PATH, index=False)

        file_size_mb = os.path.getsize(PROCESSED_FILE_PATH) / (1024 * 1024)
        print("\n🎉 Preprocessing Complete!")
        print(f"📊 Total Aggregated Records: {len(final_gp_df)}")
        print(f"💾 File Size: {file_size_mb:.2f} MB")
        print(f"✅ Saved clean file to: {PROCESSED_FILE_PATH}")

if __name__ == "__main__":
    preprocess_gp()