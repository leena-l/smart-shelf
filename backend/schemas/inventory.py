from pydantic import BaseModel
from datetime import date
from typing import Optional

class ProductBase(BaseModel):
    name: str [cite: 3]
    category: str [cite: 3]
    location: Optional[str] = None [cite: 3]
    quantity: int [cite: 3]
    mfg_date: Optional[date] = None [cite: 3]
    expiry_date: date [cite: 3]
    batch_number: Optional[str] = None [cite: 3]

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    status: str

    class Config:
        from_attributes = True
        