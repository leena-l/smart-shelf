from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.inventory import Product
from app.schemas.inventory import ProductCreate, ProductResponse

router = APIRouter()

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Receives product data and saves it to PostgreSQL."""
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product) [cite: 4]
    db_product.status = db_product.get_status() [cite: 4]
    return db_product

@router.get("/", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    """Fetches all items and calculates their status for the dashboard."""
    products = db.query(Product).all()
    for p in products:
        p.status = p.get_status()
    return products