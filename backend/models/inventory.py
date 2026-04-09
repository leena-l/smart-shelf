from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class Product(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True) [cite: 1]
    name = Column(String, nullable=False) [cite: 1]
    category = Column(String, index=True) [cite: 1]
    location = Column(String) [cite: 1]
    quantity = Column(Integer, default=1) [cite: 1]
    mfg_date = Column(Date, nullable=True) [cite: 1]
    expiry_date = Column(Date, nullable=False) [cite: 1]
    batch_number = Column(String, nullable=True) [cite: 1]
    created_at = Column(DateTime(timezone=True), server_default=func.now()) [cite: 1]

    def get_status(self):
        """Calculates if the item is fresh, expiring, or expired[cite: 2]."""
        from datetime import date
        today = date.today()
        days_left = (self.expiry_date - today).days [cite: 2]
        if days_left <= 0: return "Expired" [cite: 2]
        if days_left <= 30: return "Expiring Soon" [cite: 2]
        return "In Stock" [cite: 2]