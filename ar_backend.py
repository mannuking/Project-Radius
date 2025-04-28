from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Allow all origins for dev; restrict in prod

@app.route('/api/ar-data', methods=['GET'])
def get_ar_data():
    role = request.args.get('role', 'admin').lower()
    df = pd.read_excel('AR_Model_Dummy_Data.xlsx')
    # Optionally filter/aggregate based on role
    if role == 'manager':
        # Example: managers see only certain columns or rows
        pass  # Add your logic here
    # Replace NaN with None for valid JSON
    data = df.where(pd.notnull(df), None).to_dict(orient='records')
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5001, debug=True) 
