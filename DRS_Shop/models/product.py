from db import db

class ProductModel(db.Model):
    __tablename__="products"
    
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(80),unique=False,nullable=False)
    image=db.Column(db.String(80),unique=False,nullable=False)
    price=db.Column(db.Integer,unique=False,nullable=False)
    currency=db.Column(db.String(80),unique=False,nullable=False)
    quantity=db.Column(db.Integer,unique=False,nullable=False)
    

