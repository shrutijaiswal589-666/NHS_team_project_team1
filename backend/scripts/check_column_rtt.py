import pandas as pd
import glob
import os

# Find the raw folder
RAW_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw"))

# Find the first CSV file
all_files = glob.glob(os.path.join(RAW_DIR_PATH, "*.csv"))

if all_files:
    file_path = all_files[0]
    print(f"Checking columns for: {os.path.basename(file_path)}\n")
    
    # Read just the first row to get the columns
    df = pd.read_csv(file_path, nrows=1, low_memory=False)
    
    # Print them out exactly as they appear
    print("EXACT COLUMN NAMES IN THIS FILE:")
    print("--------------------------------")
    for col in df.columns:
        print(f"'{col}'")
else:
    print("No CSV files found in the raw folder!")