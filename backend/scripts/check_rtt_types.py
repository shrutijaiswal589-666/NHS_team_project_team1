import pandas as pd
import glob
import os

# Find the raw folder
RAW_DIR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw"))

# Find the first CSV file
all_files = glob.glob(os.path.join(RAW_DIR_PATH, "*.csv"))

if all_files:
    file_path = all_files[0]
    print(f"Checking RTT Part Types in: {os.path.basename(file_path)}\n")
    
    # Read the CSV (just the columns we care about to be fast)
    df = pd.read_csv(file_path, usecols=['RTT Part Description'], low_memory=False)
    
    # Print out every unique value in that column
    print("UNIQUE VALUES IN 'RTT Part Description':")
    print("----------------------------------------")
    unique_values = df['RTT Part Description'].dropna().unique()
    for val in unique_values:
        print(f"'{val}'")
else:
    print("No CSV files found in the raw folder!")