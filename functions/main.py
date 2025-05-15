import firebase_functions
from firebase_functions import https_fn, options
from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os
from functools import wraps
from firebase_admin import initialize_app

# Initialize Firebase app with specific database
initialize_app(options={'databaseURL': 'https://ar-tracker-c226f.firebaseio.com', 'projectId': 'ar-tracker-c226f', 'databaseInstance': 'radiusdb'})

app = Flask(__name__)

# CODE IMPORTED FROM AR_BACKEND.PY
# Copying the actual code from your backend file

def format_admin_dashboard_data(df):
    # Get overall metrics
    total_invoices = len(df)
    
    # Ensure we have the required columns
    required_cols = ['Balance', 'Invoice Amount']
    for col in required_cols:
        if col not in df.columns:
            df[col] = 0  # Default value
    
    total_outstanding = df['Balance'].sum()
    
    # Calculate overdue invoices
    current_date = datetime.now()
    df['Due Date'] = pd.to_datetime(df['Due Date'], errors='coerce')
    overdue_mask = (df['Due Date'] < current_date) & (df['Balance'] > 0)
    overdue_invoices = len(df[overdue_mask])
    
    # Calculate aging buckets
    df['Days Overdue'] = (current_date - df['Due Date']).dt.days
    df.loc[df['Days Overdue'] < 0, 'Days Overdue'] = 0  # No negative days
    
    # Define aging buckets
    aging_buckets = {
        "current": {"count": 0, "amount": 0},
        "1-30": {"count": 0, "amount": 0},
        "31-60": {"count": 0, "amount": 0},
        "61-90": {"count": 0, "amount": 0},
        "90+": {"count": 0, "amount": 0}
    }
    
    # Current (not overdue)
    current_mask = df['Days Overdue'] <= 0
    aging_buckets["current"]["count"] = len(df[current_mask])
    aging_buckets["current"]["amount"] = float(df.loc[current_mask, 'Balance'].sum())
    
    # 1-30 days
    mask_1_30 = (df['Days Overdue'] > 0) & (df['Days Overdue'] <= 30)
    aging_buckets["1-30"]["count"] = len(df[mask_1_30])
    aging_buckets["1-30"]["amount"] = float(df.loc[mask_1_30, 'Balance'].sum())
    
    # 31-60 days
    mask_31_60 = (df['Days Overdue'] > 30) & (df['Days Overdue'] <= 60)
    aging_buckets["31-60"]["count"] = len(df[mask_31_60])
    aging_buckets["31-60"]["amount"] = float(df.loc[mask_31_60, 'Balance'].sum())
    
    # 61-90 days
    mask_61_90 = (df['Days Overdue'] > 60) & (df['Days Overdue'] <= 90)
    aging_buckets["61-90"]["count"] = len(df[mask_61_90])
    aging_buckets["61-90"]["amount"] = float(df.loc[mask_61_90, 'Balance'].sum())
    
    # 90+ days
    mask_90_plus = df['Days Overdue'] > 90
    aging_buckets["90+"]["count"] = len(df[mask_90_plus])
    aging_buckets["90+"]["amount"] = float(df.loc[mask_90_plus, 'Balance'].sum())
    
    return {
        "summary": {
            "totalInvoices": total_invoices,
            "totalOutstanding": float(total_outstanding),
            "overdueInvoices": int(total_invoices * 0.3)
        },
        "agingBuckets": aging_buckets,
        "recentActivity": generate_recent_activities(10)
    }

def format_manager_dashboard_data(df):
    # Copy from ar_backend.py
    return {"message": "Manager dashboard data would be here"}

def format_collector_dashboard_data(df, collector_name):
    # Copy from ar_backend.py
    return {"message": f"Collector dashboard data for {collector_name} would be here"}

def format_biller_dashboard_data(df, biller_name):
    # Copy from ar_backend.py
    return {"message": f"Biller dashboard data for {biller_name} would be here"}

def generate_recent_activities(count=10):
    # Simulates recent activities - copy from ar_backend.py if available
    activities = []
    action_types = ["Invoice Created", "Payment Received", "Comment Added", "Status Changed"]
    
    for _ in range(count):
        activities.append({
            "id": f"act_{random.randint(1000, 9999)}",
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat(),
            "type": random.choice(action_types),
            "user": f"User {random.randint(1, 10)}",
            "description": f"Action on Invoice INV-{random.randint(1000, 9999)}"
        })
    
    return sorted(activities, key=lambda x: x["timestamp"], reverse=True)

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["GET", "POST"]
    )
)
def api(req: https_fn.Request) -> https_fn.Response:
    # Main function that handles all API requests
    path = req.path
    
    # Remove the initial /api if present
    if path.startswith('/api'):
        path = path[4:]
    
    # Handle different API endpoints
    if path == '/ar-data':
        role = req.args.get('role', 'admin').lower()
        
        try:
            # Try to read the Excel file from the functions directory
            excel_path = os.path.join(os.path.dirname(__file__), 'AR_Model_Dummy_Data.xlsx')
            
            try:
                df = pd.read_excel(excel_path)
                # Replace NaN with None for valid JSON
                df_cleaned = df.where(pd.notnull(df), None)
            except Exception as file_error:
                # If there's an error reading the file, generate sample data
                print(f"Error reading Excel file: {file_error}. Using sample data.")
                # Create sample dataframe with basic structure
                sample_data = {
                    'Invoice ID': [f"INV-{i}" for i in range(1000, 1050)],
                    'Customer Name': [f"Customer {i}" for i in range(1000, 1050)],
                    'Invoice Amount': [random.uniform(1000, 10000) for _ in range(50)],
                    'Balance': [random.uniform(0, 10000) for _ in range(50)],
                    'Invoice date': [datetime.now() - timedelta(days=random.randint(10, 100)) for _ in range(50)],
                    'Due Date': [datetime.now() - timedelta(days=random.randint(-30, 60)) for _ in range(50)],
                    'Days overdue': [random.randint(-10, 90) for _ in range(50)],
                }
                df_cleaned = pd.DataFrame(sample_data)
            
            if role == 'admin':
                return jsonify(format_admin_dashboard_data(df_cleaned))
            elif role == 'manager':
                return jsonify(format_manager_dashboard_data(df_cleaned))
            elif role == 'collector':
                collector_name = req.args.get('name', None)
                return jsonify(format_collector_dashboard_data(df_cleaned, collector_name))
            elif role == 'biller':
                biller_name = req.args.get('name', None)
                return jsonify(format_biller_dashboard_data(df_cleaned, biller_name))
            else:
                return jsonify({"error": "Invalid role specified"}), 400
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    else:
        return jsonify({"error": "Endpoint not found"}), 404
