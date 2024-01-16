from flask.views import MethodView
from flask_smorest import Blueprint,abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required,get_jwt_identity
from flask import jsonify
from mail_notify import send_mail

from sqlalchemy.exc import SQLAlchemyError
from db import db
from models import ProductModel,CardModel,UserModel,BillModel
from schemas import CashCheckSchema,CashUpdateSchema
from exchange import exchange_converter

blp=Blueprint("Payments",__name__,description="Payment methods")


@blp.route("/cash")
class CashRegister(MethodView):
    
    @jwt_required()
    @blp.response(200,CashCheckSchema)
    def get(self):
        
        jwt=get_jwt_identity()
        
        card=CardModel.query.filter(CardModel.userId==jwt).first()
        
        if card is None:
            abort(400,message="You haven't sent card for verification.")
        
        if not card.verified:
            abort(400,message="The administrator haven't verified your account.")
        
        
        return card

    @jwt_required()
    @blp.arguments(CashUpdateSchema)
    @blp.response(200,CashUpdateSchema)
    def put(self,cash_data):
        
        jwt=get_jwt_identity()
        
        card=CardModel.query.filter(CardModel.userId==jwt).first()
        
        if card is None:
            abort(400,message="You haven't sent card for verification.")
        
        if not card.verified:
            abort(400,message="The administrator haven't verified your account.")
        
        money=cash_data["money"]
        currency=cash_data["currency"]
        current_state=card.money
        
        wantToAdd=exchange_converter(money,currency,card.currency)
        
        card.money=current_state+wantToAdd
        
        try:
            db.session.add(card)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,"An error occured during transaction.")
        
        return card
        
#Ovdje sam stao
@blp.route("/buy")
class MoneyTransactions(MethodView):
    
    def post(self,data):
        pass     
        
        
        
        
        
    
