from db import db

class BlockListModel(db.Model):
    __tablename__="blocklist"
    
    id=db.Column(db.Integer,primary_key=True)
    token=db.Column(db.String(80),unique=False,nullable=False)
    