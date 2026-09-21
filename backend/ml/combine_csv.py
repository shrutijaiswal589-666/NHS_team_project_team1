import pandas as pd
import glob
import os

# Folder containing CSV files
folder_path = "/NHS-Project/Jan-may2026_rtt_rawData"

# Get all CSV files
csv_files = glob.glob(os.path.join(folder_path, "*.csv"))

# Read and combine
df = pd.concat(
    [pd.read_csv(file) for file in csv_files],
    ignore_index=True
)

# Save combined CSV
df.to_csv("/NHS-Project/Jan-may2026_rtt_rawData/Combined_rtt.csv", index=False)

print(f"{len(csv_files)} CSV files combined successfully!")
print("Total rows:", len(df))
