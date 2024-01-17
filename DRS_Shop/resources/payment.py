from flask.views import MethodView
from flask_smorest import Blueprint,abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required,get_jwt_identity
from flask import jsonify
from mail_notify import send_mail

from workers.payment_worker import shared as mem
from workers.payment_worker import semaphore_manager,semaphore_db_1,semaphore_db_2,semaphore_db_3,check_verify,check_quantity,check_money,user_accout_update,bill_insert,product_q_update,admin_account_update
from multiprocessing import Process,Manager
from sqlalchemy.exc import SQLAlchemyError
from db import db
from models import ProductModel,CardModel,UserModel,BillModel
from schemas import CashCheckSchema,CashUpdateSchema,BillSchema,BillSchemaResponse,AdminBillSchemaResponse,ConvertSchema,ConvertDASchema
from exchange import exchange_converter



manage=semaphore_manager
ds1=semaphore_db_1
ds2=semaphore_db_2
ds3=semaphore_db_3



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
        
        mem["data_buy"]=data_buy
        
        p1=Process(target=check_verify,args=(jwt,manage,ds1,mem))
        p2=Process(target=check_quantity,args=(manage,ds2,mem))
        p3=Process(target=check_money,args=(jwt,manage,ds1,mem))
        
        p1.start()
        p2.start()
        p3.start()
        
        p1.join()
        p2.join()
        p3.join()
        
        
        
        if(mem["verify_error"]==400):
            abort(400,message="Your account is not verified.")
        elif(mem["money_error"]==400):
            abort(400,message="Your don't have enough money on account.")
        elif(mem["quantity_error"]==400):
            abort(400,message="Not enough products.")
        
        
        p4=Process(target=user_accout_update,args=(jwt,manage,ds1,mem))
        p5=Process(target=bill_insert,args=(jwt,manage,ds1,ds3,mem))
        p6=Process(target=product_q_update,args=(manage,ds2,mem))
        p7=Process(target=admin_account_update,args=(manage,ds1,mem))
        
        p4.start()
        p5.start()
        p6.start()
        p7.start()
        
        p4.join()
        p5.join()
        p6.join()
        p7.join()
        
        if(mem["database_error"]==500):
            abort(500,"An error occured during transaction.")
        else:
            mem["data_buy"]=''
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
    def put(self,data):
        
        jwt=get_jwt_identity()
        
        user=CardModel.query.filter(CardModel.userId==jwt).first()
        
        if user is None:
            abort(400,message="You haven't sent card for verification.")
        
        if not user.verified:
            abort(400,message="The administrator haven't verified your account.")
        
        
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
        
    @jwt_required()
    @blp.arguments(ConvertDASchema)
    def post(self,data):

        
        prdt=ProductModel.query.get(data["id"])
        
        mmi=prdt.price
        jdt=prdt.currency
        ccr=data["currency"]
        
        valt=exchange_converter(mmi,jdt,ccr)
        
        
        
        return {"money":valt,"currency":ccr},200 
    
