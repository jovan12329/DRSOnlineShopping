from db import db

class CardModel(db.Model):
    __tablename__="cards"
    
    id=db.Column(db.Integer,primary_key=True)
    userId=db.Column(db.Integer,unique=True,nullable=False)
    email=db.Column(db.String(80),unique=True,nullable=False)
    cardNumber=db.Column(db.String(80),unique=True,nullable=False)
    money=db.Column(db.Float,unique=False,nullable=False)
    currency=db.Column(db.String(80),unique=False,nullable=False)
    verified=db.Column(db.Boolean,unique=False,nullable=False)
    