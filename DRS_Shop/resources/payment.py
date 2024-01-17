from flask.views import MethodView
from flask_smorest import Blueprint,abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required,get_jwt_identity
from flask import jsonify
from mail_notify import send_mail

from multiprocessing import Semaphore

from sqlalchemy.exc import SQLAlchemyError
from db import db
from models import ProductModel,CardModel,UserModel,BillModel
from schemas import CashCheckSchema,CashUpdateSchema,BillSchema,BillSchemaResponse,AdminBillSchemaResponse,ConvertSchema
from exchange import exchange_converter


db_semaphore=Semaphore(1)


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
    
    @jwt_required()
    @blp.arguments(BillSchema)
    def post(self,data_buy):
         
        jwt=get_jwt_identity()
         
        card=CardModel.query.filter(CardModel.userId==jwt).first()
        
        if card is None:
            abort(400,message="You haven't sent card for verification.")
        
        if not card.verified:
            abort(400,message="The administrator haven't verified your account.")
            
        valuta=data_buy["currency"]
        cenaOriginalna=data_buy["price"]
        kolicina=data_buy["quantity"]
        
        
        pwd=ProductModel.query.get(data_buy["productId"])
        
        if pwd.quantity<kolicina:
            abort(400,message="Not enough items on stock.")
        
        
        koverzija=exchange_converter(cenaOriginalna,valuta,card.currency)
        cenaQuantity= kolicina*koverzija
        
        
        if card.money<cenaQuantity:
            abort(400,message="You don't have enough money for transaction.")
        
        card.money -=cenaQuantity
        
        admin=CardModel.query.filter(CardModel.userId==1).first()
        
        admin.money +=cenaQuantity
        
        koverzija=exchange_converter(cenaQuantity,card.currency,valuta)
        
        racun=BillModel(email=card.email,
                        productId=data_buy["productId"],
                        name=data_buy["name"],
                        price=koverzija,
                        currency=valuta,
                        quantity=kolicina)
        
        
        pwd.quantity -= kolicina
        
        try:
            db.session.add(admin)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,"An error occured during transaction.")
        
        try:
            db.session.add(card)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured during transaction.")
        
        try:
            db.session.add(racun)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured during transaction.")
        
        try:
            db.session.add(pwd)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured during transaction.")
        
        
        
        return {"message":"Product is purchased."},200
        
    @jwt_required()
    @blp.response(200,AdminBillSchemaResponse(many=True))
    def get(self):
        
        jwt=get_jwt_identity()
        
        if jwt!=1:
            abort(401,message="Admin privilege required.")
        
        return BillModel.query.all()
        

@blp.route("/history")
class TraceHistory(MethodView):
    
    @jwt_required()
    @blp.response(200,BillSchemaResponse(many=True))
    def get(self):
        
        jwt=get_jwt_identity()
        
        user=CardModel.query.filter(CardModel.userId==jwt).first()
        
        billing=BillModel.query.filter(BillModel.email==user.email)
        
        return billing
    
     
@blp.route("/convert")
class MoneyConversion(MethodView):
    
    @jwt_required()
    @blp.arguments(ConvertSchema)
    def post(self,data):
        
        jwt=get_jwt_identity()
        
        user=CardModel.query.filter(CardModel.userId==jwt).first()
        
        ccr=data["currency"]
        
        valt=exchange_converter(user.money,user.currency,ccr)
        
        user.money=valt
        user.currency=ccr
        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured during transaction.")
        
        return {"money":user.money,"currency":user.currency},200       
        
        
    
