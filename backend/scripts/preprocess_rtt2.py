import pandas as pd
import os
import glob
import math

# ==========================================
# 1. SETUP FILE PATHS
# ==========================================
# Assuming you run this from inside the backend/scripts/ folder
RAW_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw"))
PROCESSED_FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed", "clean_rtt2.csv"))

def preprocess_rtt():
    print(f"⏳ Searching for CSV files in {RAW_DIR_PATH}...")
    
    # Find all CSV files in the raw directory
    all_files = glob.glob(os.path.join(RAW_DIR_PATH, "*.csv"))
    
    if not all_files:
        print(f"❌ ERROR: No CSV files found in {RAW_DIR_PATH}")
        print("Please extract the downloaded NHS ZIP files into the raw folder!")
        return

    print(f"✅ Found {len(all_files)} files to process.")
    
    processed_dataframes = []

    # ==========================================
    # 2. PROCESSING LOOP (File by File)
    # ==========================================
    for file_path in all_files:
        file_name = os.path.basename(file_path)
        print(f"\n🔄 Processing {file_name}...")
        
        try:
            # Read the CSV (low_memory=False prevents mixed-type warnings)
            df = pd.read_csv(file_path, low_memory=False)
            print(f"   📊 Original rows in file: {len(df)}")
            
            # Step A: Standardize column names (lowercase, no spaces)
            df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')
            
            # Step B: Filter to ONLY 'Incomplete' pathways (patients currently waiting)
            # --> WE FIXED THE COLUMN NAME HERE <--
            if 'rtt_part_description' in df.columns:
                df = df[df['rtt_part_description'].str.contains('Incomplete', case=False, na=False)]
                print(f"   ✂️ Rows after 'Incomplete' filter: {len(df)}")
            else:
                print(f"   ⚠️ 'rtt_part_description' missing! Columns are: {list(df.columns)[:10]}")
            
            # Step C: Remove National/Regional Totals to avoid double counting
            if 'provider_org_code' in df.columns:
                df = df[df['provider_org_code'].notna()]
                df = df[df['provider_org_code'] != 'ENG']
                
            # ---> NEW: Remove 'Total' treatment rows to avoid double counting <---
            if 'treatment_function_name' in df.columns:
                df = df[~df['treatment_function_name'].str.contains('Total', case=False, na=False)]
                
            print(f"   ✂️ Rows after removing totals: {len(df)}")
            
            # Step D: Find all the wait time bucket columns (e.g., gt_00_to_01_weeks_sum_1)
            bucket_columns = [col for col in df.columns if col.startswith('gt_') and col != 'gt_104_weeks_sum_1']
            
            # Ensure they are numeric, fill blanks with 0
            df[bucket_columns] = df[bucket_columns].apply(pd.to_numeric, errors='coerce').fillna(0)
            
            if 'total_all' in df.columns:
                df['total_all'] = pd.to_numeric(df['total_all'], errors='coerce').fillna(0)
            elif 'total' in df.columns:
                df['total_all'] = pd.to_numeric(df['total'], errors='coerce').fillna(0)
                
            # Step E: Feature Engineering - Grouping into useful AI Bins
            print(f"   🧮 Calculating 18-week targets and averages for {file_name}...")
            
            import warnings
            from pandas.errors import PerformanceWarning
            warnings.simplefilter(action='ignore', category=PerformanceWarning)
            
            # 1. Under 18 Weeks (0 to 18)
            # The columns are formatted like 'gt_00_to_01_weeks_sum_1'
            under_18_cols = [col for col in bucket_columns if int(col.split('_')[1]) < 18]
            df['wait_under_18_weeks'] = df[under_18_cols].sum(axis=1)
            
            # 2. 18 to 52 Weeks
            mid_wait_cols = [col for col in bucket_columns if 18 <= int(col.split('_')[1]) < 52]
            df['wait_18_to_52_weeks'] = df[mid_wait_cols].sum(axis=1)
            
            # 3. Over 52 Weeks (52+)
            over_52_cols = [col for col in bucket_columns if int(col.split('_')[1]) >= 52]
            df['wait_over_52_weeks'] = df[over_52_cols].sum(axis=1)
            
            # If the specific 104+ column exists, add it to the over 52 total
            if 'gt_104_weeks_sum_1' in df.columns:
                df['gt_104_weeks_sum_1'] = pd.to_numeric(df['gt_104_weeks_sum_1'], errors='coerce').fillna(0)
                df['wait_over_52_weeks'] += df['gt_104_weeks_sum_1']

            # Step F: Calculate Estimated Average Wait Time (Weighted Mean)
            def calculate_estimated_mean(row):
                total_wait_weeks = 0
                total_patients = 0
                
                for col in bucket_columns:
                    parts = col.split('_')
                    try:
                        # Extract the start and end weeks from 'gt_XX_to_YY_weeks_sum_1'
                        start_week = int(parts[1])
                        # We must be careful because parts[3] might be 'weeks' if the format is different
                        # In 'gt_00_to_01_weeks_sum_1', parts[3] is '01'
                        end_week = int(parts[3]) 
                        midpoint = (start_week + end_week) / 2.0
                        patient_count = row[col]
                        total_wait_weeks += (midpoint * patient_count)
                        total_patients += patient_count
                    except (IndexError, ValueError):
                        pass 
                
                if 'gt_104_weeks_sum_1' in row:
                    count_104_plus = row['gt_104_weeks_sum_1']
                    if count_104_plus > 0:
                        total_wait_weeks += (105.0 * count_104_plus)
                        total_patients += count_104_plus

                if total_patients > 0:
                    return total_wait_weeks / total_patients
                return 0.0

            df['estimated_average_wait_time'] = df.apply(calculate_estimated_mean, axis=1)
            
            # Step G: Keep only the essential columns (Dramatically reduces file size!)
            essential_cols = [
                'period', 
                'provider_org_code', 
                'provider_org_name', 
                'treatment_function_code', 
                'treatment_function_name', 
                'total_all',
                'wait_under_18_weeks',
                'wait_18_to_52_weeks',
                'wait_over_52_weeks',
                'estimated_average_wait_time'
            ]
            
            # Ensure all columns exist before selecting
            keep_cols = [col for col in essential_cols if col in df.columns]
            
            df_lean = df[keep_cols].copy()
            
            # Append the lean dataframe to our master list
            processed_dataframes.append(df_lean)
            print(f"   ✅ Processed {len(df_lean)} rows (discarded raw bucket columns).")
            
        except Exception as e:
            print(f"   ❌ ERROR processing {file_name}: {e}")

    # ==========================================
    # 3. COMBINE AND EXPORT
    # ==========================================
    if processed_dataframes:
        print("\n⏳ Combining all months into a single master dataset...")
        master_df = pd.concat(processed_dataframes, ignore_index=True)
        
        # Ensure the processed folder exists
        os.makedirs(os.path.dirname(PROCESSED_FILE_PATH), exist_ok=True)
        
        print(f"💾 Saving {len(master_df)} total rows to {PROCESSED_FILE_PATH}...")
        master_df.to_csv(PROCESSED_FILE_PATH, index=False)
        
        # Calculate file size
        file_size_mb = os.path.getsize(PROCESSED_FILE_PATH) / (1024 * 1024)
        print(f"🎉 Success! Final dataset ready for database ingestion.")
        print(f"📉 Final file size: {file_size_mb:.2f} MB (Easily fits in Neon/Supabase free tiers!)")
    else:
        print("❌ No data was successfully processed.")

if __name__ == "__main__":
    preprocess_rtt()