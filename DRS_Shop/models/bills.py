from db import db

class BillModel(db.Model):
    __tablename__="bills"
    
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String(80),unique=False,nullable=False)
    productId=db.Column(db.Integer,unique=False,nullable=False)
    name=db.Column(db.String(80),unique=False,nullable=False)
    price=db.Column(db.Integer,unique=False,nullable=False)
    currency=db.Column(db.String(80),unique=False,nullable=False)
    quantity=db.Column(db.Integer,unique=False,nullable=False)