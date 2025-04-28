import pandas as pd
import numpy as np
import random
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker to generate realistic fake data
fake = Faker()

# Configuration
num_rows = 150
output_filename = 'AR_Model_Dummy_Data.xlsx'
start_date = datetime(2023, 1, 1)
end_date = datetime.now()

# Possible values for categorical columns
customer_types = ['Commercial', 'Government', 'Small Business', 'Enterprise']
customer_terms = ['NET 15', 'NET 30', 'NET 60', 'NET 90']
collector_names = [fake.first_name_female() for _ in range(5)] # Example: 5 collectors
biller_names = [fake.first_name_male() for _ in range(3)] # Example: 3 billers
client_directors = [fake.name() for _ in range(2)] # Example: 2 directors
statuses = ['Pending', 'Paid', 'Disputed', 'Overdue', 'Write-off']
root_causes = ['Billing Error', 'Customer Dispute', 'Late Payment', 'Internal Delay', 'None']
outcome_statuses = ['Resolved', 'Pending Investigation', 'Escalated', 'Closed']
assigned_responsibles = ['Biller', 'Collector', 'Director', 'Manager']
dispute_codes = ['DC01', 'DC02', 'DC03', 'DC04', 'NA']

# --- Data Generation ---
data = []
current_customer_id = 11001
current_invoice_number_base = 170501275

for i in range(num_rows):
    customer_name = fake.company()
    customer_id = current_customer_id + i
    invoice_number = current_invoice_number_base + i
    collector_name = random.choice(collector_names)
    biller_name = random.choice(biller_names)
    client_director = random.choice(client_directors)

    # Generate dates
    invoice_date = fake.date_between(start_date=start_date, end_date=end_date)
    term_str = random.choice(customer_terms)
    term_days = int(term_str.split(' ')[1]) if 'NET' in term_str else 30 # Default if format unknown
    due_date = invoice_date + timedelta(days=term_days)

    invoice_amount = round(random.uniform(500, 50000), 2)
    customer_type = random.choice(customer_types)

    # --- Calculated/Derived Fields (Simplified Simulation) ---
    calculated_terms = term_days # Simplified
    weighted_calculated_terms = calculated_terms * invoice_amount # Simplified

    today = datetime.now().date()
    days_overdue = (today - due_date).days if today > due_date else 0

    # Simplified overdue bucket logic (based on screenshot hints)
    if days_overdue <= 0:
        overdue_bucket = "Current"
        weighted_overdue_amount = 0
    elif days_overdue <= 30:
        overdue_bucket = "0-30"
        weighted_overdue_amount = invoice_amount # Simplified weight
    elif days_overdue <= 60:
        overdue_bucket = "31-60"
        weighted_overdue_amount = invoice_amount * 1.1 # Example weighting
    elif days_overdue <= 90:
        overdue_bucket = "61-90"
        weighted_overdue_amount = invoice_amount * 1.2
    elif days_overdue <= 120:
        overdue_bucket = "91-120"
        weighted_overdue_amount = invoice_amount * 1.3
    else:
        overdue_bucket = "120+"
        weighted_overdue_amount = invoice_amount * 1.4

    weighted_avg_overdue_days = days_overdue # Simplification

    # Determine Status based on overdue days
    if days_overdue <= 0 and random.random() < 0.2: # Small chance current invoices are paid
        invoice_status = "Paid"
    elif days_overdue <= 0:
        invoice_status = "Current"
    elif random.random() < 0.05: # Small chance overdue are paid
         invoice_status = "Paid"
    elif random.random() < 0.1:
         invoice_status = "Disputed"
    else:
        invoice_status = f"Overdue {overdue_bucket}"


    dispute_code_l1 = random.choice(dispute_codes) if invoice_status == "Disputed" else "NA"
    dispute_code_l2 = random.choice(dispute_codes) if invoice_status == "Disputed" and random.random() > 0.5 else "NA"
    dispute_code_l3 = random.choice(dispute_codes) if invoice_status == "Disputed" and random.random() > 0.8 else "NA"

    assigned_responsible = random.choice(assigned_responsibles)
    root_cause = random.choice(root_causes) if invoice_status not in ["Paid", "Current"] else "None"
    outcome_status = random.choice(outcome_statuses) if invoice_status not in ["Paid", "Current"] else "N/A"
    comments = fake.sentence(nb_words=6) if random.random() > 0.7 else ""

    # Date parts
    invoice_day_of_month = invoice_date.day
    invoice_day_of_week = invoice_date.strftime('%A')
    invoice_month = invoice_date.strftime('%m/%d/%Y') # Assuming MM/DD/YYYY format like screenshot
    due_day_of_month = due_date.day
    due_day_of_week = due_date.strftime('%A')
    due_month = due_date.strftime('%m/%d/%Y') # Assuming MM/DD/YYYY format


    data.append({
        'Customer Name': customer_name,
        'Customer ID': customer_id,
        'Invoice number': invoice_number,
        'Collector Name': collector_name,
        'Biller Name': biller_name,
        'Client Director': client_director,
        'Invoice date': invoice_date.strftime('%d-%b'), # Format like '10-Jan'
        'Invoice due date': due_date.strftime('%d-%b'), # Format like '25-Jan'
        'Invoice Amount': invoice_amount,
        'Customer terms': term_str,
        'Customer type': customer_type,
        'Calculated terms': calculated_terms,
        'Weighted calculated terms': weighted_calculated_terms,
        'Days overdue': days_overdue,
        'Weighted Overdue Amount': weighted_overdue_amount, # Assuming this maps to 'Weighted Overdue Bucket' value
        'Weighted Overdue Bucket': overdue_bucket, # Adding the bucket description
        'Weighted Average Overdue days (Customer)': weighted_avg_overdue_days, # Simplified - Placeholder
        'Weighted Average Overdue days (Collector)': weighted_avg_overdue_days, # Simplified - Placeholder
        'Weighted Average Overdue days (Biller)': weighted_avg_overdue_days, # Simplified - Placeholder
        'Invoice Status': invoice_status, # Mapping to 'Status' column T?
        'Dispute code L1': dispute_code_l1, # Mapping to col U
        'Dispute code L2': dispute_code_l2, # Mapping to col V
        'Dispute code L3': dispute_code_l3, # Mapping to col W
        'Assigned Responsible': assigned_responsible, # Mapping to col X
        'Root cause dropdown': root_cause, # Mapping to col Y
        'Outcome Status': outcome_status, # Mapping to col Z
        'Comments': comments, # Mapping to col AA
        'Invoice day of month': invoice_day_of_month, # Mapping to col AB
        'Invoice day of month Dup': invoice_day_of_month, # Duplicate? Assuming based on screenshot (AC)
        'Due day of month': due_day_of_month, # Mapping to AD
        'Invoice day of week': invoice_day_of_week, # Mapping to AE
        'Due day of week': due_day_of_week, # Mapping to AF
        'Invoice month': invoice_month, # Mapping to AG
        'Due month': due_month # Mapping to AH
        # Add other columns from screenshots if needed, generating appropriate dummy data
    })

# Create DataFrame
df = pd.DataFrame(data)

# Reorder columns to roughly match screenshots (adjust as needed)
# This is based on visual inspection and might need refinement
column_order = [
    'Customer Name', 'Customer ID', 'Invoice number', 'Collector Name', 'Biller Name', 'Client Director', # A-F
    'Invoice date', 'Invoice due date', 'Invoice Amount', 'Customer terms', 'Customer type', # G-K
    'Calculated terms', 'Weighted calculated terms', # L-M
    'Days overdue', 'Weighted Overdue Amount', 'Weighted Overdue Bucket', # N-P (Mapping Amount to O)
    'Weighted Average Overdue days (Customer)', 'Weighted Average Overdue days (Collector)', 'Weighted Average Overdue days (Biller)', # Q-S (Using simplified days for now)
    'Invoice Status', # T
    'Dispute code L1', 'Dispute code L2', 'Dispute code L3', # U-W
    'Assigned Responsible', 'Root cause dropdown', 'Outcome Status', 'Comments', # X-AA
    'Invoice day of month', 'Invoice day of month Dup', 'Due day of month', # AB-AD
    'Invoice day of week', 'Due day of week', 'Invoice month', 'Due month' # AE-AH
]
# Add any missing columns generated that aren't in the desired order yet
# This ensures all generated data is included, even if the order isn't perfect
existing_columns = df.columns.tolist()
final_columns = column_order + [col for col in existing_columns if col not in column_order]
df = df[final_columns]


# --- Save to Excel ---
try:
    df.to_excel(output_filename, index=False, engine='openpyxl')
    print(f"Successfully generated dummy data in '{output_filename}' with {len(df)} rows.")
except Exception as e:
    print(f"Error saving file: {e}")
    print("Make sure the file is not open elsewhere and you have permissions to write here.") 
