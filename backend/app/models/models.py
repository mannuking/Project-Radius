from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Enum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

class AgingBucket(enum.Enum):
    CURRENT = "Current"
    DAYS_1_30 = "1-30 days"
    DAYS_31_60 = "31-60 days"
    DAYS_61_90 = "61-90 days"
    DAYS_91_120 = "91-120 days"
    OVER_120 = "Over 120 days"

class PaymentStatus(enum.Enum):
    PAID = "Paid"
    PARTIAL = "Partial"
    OVERDUE = "Overdue"
    DISPUTED = "Disputed"

class RootCause(enum.Enum):
    BILLING_ERROR = "Billing Error"
    DELIVERY_ISSUE = "Delivery Issue"
    PO_MISMATCH = "PO Mismatch"
    CUSTOMER_DISPUTE = "Customer Dispute"
    PAYMENT_PROCESSING = "Payment Processing"
    OTHER = "Other"

class ARInvoice(Base):
    __tablename__ = "ar_invoices"

    id = Column(Integer, primary_key=True, index=True)
    operating_unit = Column(String, index=True)
    customer_name = Column(String, index=True)
    customer_id = Column(String, index=True)
    invoice_number = Column(String, unique=True, index=True)
    invoice_date = Column(Date)
    due_date = Column(Date)
    invoice_amount = Column(Float)
    currency = Column(String)
    current_payment_status = Column(Enum(PaymentStatus))
    aging_bucket = Column(Enum(AgingBucket))
    days_overdue = Column(Integer)
    root_cause = Column(Enum(RootCause), nullable=True)
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_date = Column(DateTime(timezone=True), nullable=True)
    last_updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    assigned_user = relationship("User", foreign_keys=[assigned_user_id], back_populates="assigned_invoices")
    last_updated_by_user = relationship("User", foreign_keys=[last_updated_by])
    comments = relationship("InvoiceComment", back_populates="invoice")
    contact_attempts = relationship("ContactAttempt", back_populates="invoice")
    ptps = relationship("PromiseToPay", back_populates="invoice")

    def calculate_aging_bucket(self):
        if self.days_overdue <= 0:
            return AgingBucket.CURRENT
        elif self.days_overdue <= 30:
            return AgingBucket.DAYS_1_30
        elif self.days_overdue <= 60:
            return AgingBucket.DAYS_31_60
        elif self.days_overdue <= 90:
            return AgingBucket.DAYS_61_90
        elif self.days_overdue <= 120:
            return AgingBucket.DAYS_91_120
        else:
            return AgingBucket.OVER_120

class InvoiceComment(Base):
    __tablename__ = "invoice_comments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("ar_invoices.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    invoice = relationship("ARInvoice", back_populates="comments")
    user = relationship("User", back_populates="comments")

class ContactAttempt(Base):
    __tablename__ = "contact_attempts"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("ar_invoices.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    contact_date = Column(DateTime(timezone=True))
    contact_method = Column(String)  # Phone, Email, etc.
    contact_person = Column(String)
    outcome = Column(Text)
    next_follow_up = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    invoice = relationship("ARInvoice", back_populates="contact_attempts")
    user = relationship("User", back_populates="contact_attempts")

class PromiseToPay(Base):
    __tablename__ = "promise_to_pays"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("ar_invoices.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    promised_date = Column(Date)
    promised_amount = Column(Float)
    status = Column(String)  # Pending, Fulfilled, Broken
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    invoice = relationship("ARInvoice", back_populates="ptps")
    user = relationship("User", back_populates="ptps") 
