from datetime import datetime
import pandas as pd
from sqlalchemy.orm import Session
from ..models.models import ARInvoice, PaymentStatus, AgingBucket

class ARService:
    @staticmethod
    def calculate_days_overdue(due_date: datetime) -> int:
        """Calculate the number of days an invoice is overdue."""
        today = datetime.now().date()
        due_date = due_date.date()
        return (today - due_date).days

    @staticmethod
    def process_ar_data(df: pd.DataFrame, db: Session) -> dict:
        """
        Process AR data from DataFrame and import into database.
        Returns summary of processed records.
        """
        processed_count = 0
        error_count = 0
        errors = []

        for _, row in df.iterrows():
            try:
                # Calculate days overdue
                days_overdue = ARService.calculate_days_overdue(row['due_date'])
                
                # Create AR invoice record
                ar_invoice = ARInvoice(
                    operating_unit=row['operating_unit'],
                    customer_name=row['customer_name'],
                    customer_id=row['customer_id'],
                    invoice_number=row['invoice_number'],
                    invoice_date=row['invoice_date'],
                    due_date=row['due_date'],
                    invoice_amount=float(row['invoice_amount']),
                    currency=row['currency'],
                    current_payment_status=PaymentStatus(row['payment_status']),
                    days_overdue=days_overdue
                )
                
                # Calculate aging bucket
                ar_invoice.aging_bucket = ar_invoice.calculate_aging_bucket()
                
                # Add to database
                db.add(ar_invoice)
                processed_count += 1
                
            except Exception as e:
                error_count += 1
                errors.append({
                    'invoice_number': row.get('invoice_number', 'Unknown'),
                    'error': str(e)
                })

        # Commit all changes
        db.commit()

        return {
            'processed_count': processed_count,
            'error_count': error_count,
            'errors': errors
        }

    @staticmethod
    def validate_ar_data(df: pd.DataFrame) -> tuple[bool, list]:
        """
        Validate AR data before processing.
        Returns (is_valid, validation_errors)
        """
        required_columns = [
            'operating_unit',
            'customer_name',
            'customer_id',
            'invoice_number',
            'invoice_date',
            'due_date',
            'invoice_amount',
            'currency',
            'payment_status'
        ]
        
        validation_errors = []
        
        # Check required columns
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            validation_errors.append(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Validate data types and values
        if 'invoice_amount' in df.columns:
            if not pd.to_numeric(df['invoice_amount'], errors='coerce').notna().all():
                validation_errors.append("Invalid invoice amounts found")
        
        if 'payment_status' in df.columns:
            valid_statuses = [status.value for status in PaymentStatus]
            invalid_statuses = df[~df['payment_status'].isin(valid_statuses)]['payment_status'].unique()
            if len(invalid_statuses) > 0:
                validation_errors.append(f"Invalid payment statuses found: {', '.join(invalid_statuses)}")
        
        return len(validation_errors) == 0, validation_errors 
