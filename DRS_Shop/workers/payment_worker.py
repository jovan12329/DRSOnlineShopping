from multiprocessing import Process,Manager,Semaphore
from models import BillModel,UserModel,ProductModel,CardModel
from exchange import exchange_converter
from db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os

engine = create_engine(os.environ.get('DB_URL'), poolclass=QueuePool)

# Create session factory
Session = sessionmaker(bind=engine)

man=Manager()

shared=man.dict()

shared["verify_error"]=0
shared["money_error"]=0
shared["quantity_error"]=0
shared["need_to_pay"]=0
shared["database_error"]=0
shared["paying_currency"]=''
shared["data_buy"]=''

semaphore_manager=Semaphore(1)

semaphore_db_1=Semaphore(1)
semaphore_db_2=Semaphore(1)
semaphore_db_3=Semaphore(1)




def check_verify(identity,semaphore_manage,db_sem_1,informations):
    
    session = Session()
    
    db_sem_1.acquire()
    card=session.query(CardModel).filter(CardModel.userId==identity).first()
    db_sem_1.release()
    
    semaphore_manage.acquire()
    if card is None:
        shared["verify_error"]=400
        
        
    elif not card.verified:
        shared["verify_error"]=400
    
    else:
        shared["verify_error"]=0
    
    semaphore_manage.release()


def check_quantity(semaphore_manage,db_sem_2,informations):
    
    session = Session()
    
    db_sem_2.acquire()
    pwd=session.query(ProductModel).get(shared["data_buy"]["productId"])
    db_sem_2.release()
    
    semaphore_manage.acquire()    
    if pwd.quantity<shared["data_buy"]["quantity"]:
        shared["quantity_error"]=400
    else:
        shared["quantity_error"]=0
    semaphore_manage.release()    


def check_money(identity,semaphore_manage,db_sem_1,informations):
    
    session=Session()
    
    db_sem_1.acquire()
    card=session.query(CardModel).filter(CardModel.userId==identity).first()
    db_sem_1.release()
    
    
    valuta=shared["data_buy"]["currency"]
    cenaOriginalna=shared["data_buy"]["price"]
    kolicina=shared["data_buy"]["quantity"]
    
    koverzija=exchange_converter(cenaOriginalna,valuta,card.currency)
    cenaQuantity= kolicina*koverzija
    
    semaphore_manage.acquire()
    if card.money<cenaQuantity:
        shared["money_error"]=400
        semaphore_manage.release()
    else:
        shared["need_to_pay"]=cenaQuantity
        shared["paying_currency"]=valuta
        shared["money_error"]=0
        semaphore_manage.release()
    

def user_accout_update(identity,semaphore_manage,db_sem_1,informations):
    
    session=Session()
    
    db_sem_1.acquire()
    card=session.query(CardModel).filter(CardModel.userId==identity).first()
    db_sem_1.release()
    
    semaphore_manage.acquire()
    card.money -=shared["need_to_pay"]
    semaphore_manage.release()
    
    db_sem_1.acquire()
    try:
        session.add(card)
        session.commit()
        shared["database_error"]=0
        db_sem_1.release()
    except SQLAlchemyError:
        shared["database_error"]=500
        db_sem_1.release()
        
    


def bill_insert(identity,semaphore_manage,db_sem_1,db_sem_3,informations):
    
    session=Session()
    
    db_sem_1.acquire()
    card=session.query(CardModel).filter(CardModel.userId==identity).first()
    db_sem_1.release()   
    semaphore_manage.acquire()
    koverzija=exchange_converter(shared["need_to_pay"],card.currency,shared["data_buy"]["currency"])
    semaphore_manage.release()
    
    racun=BillModel(email=card.email,
                    productId=shared["data_buy"]["productId"],
                    name=shared["data_buy"]["name"],
                    price=koverzija,
                    currency=shared["data_buy"]["currency"],
                    quantity=shared["data_buy"]["quantity"])
    
    db_sem_3.acquire()
    try:
        session.add(racun)
        session.commit()
        shared["database_error"]=0
        db_sem_3.release()
    except SQLAlchemyError:
        shared["database_error"]=500
        db_sem_3.release()
    
    

def product_q_update(semaphore_manage,db_sem_2,informations):
    
    session=Session()
    
    db_sem_2.acquire()
    pwd=session.query(ProductModel).get(shared["data_buy"]["productId"])
    db_sem_2.release()
    
    pwd.quantity -=shared["data_buy"]["quantity"]
    
    db_sem_2.acquire()
    try:
        session.add(pwd)
        session.commit()
        shared["database_error"]=0
        db_sem_2.release()
    except SQLAlchemyError:
        shared["database_error"]=500
        db_sem_2.release()
    
    

def admin_account_update(sem_man,db_sem_1,informations):
    
    session=Session()
    
    db_sem_1.acquire()
    admin=session.query(CardModel).filter(CardModel.userId==1).first()
    db_sem_1.release()
    
    sem_man.acquire()
    koverzija=exchange_converter(shared["need_to_pay"],shared["paying_currency"],admin.currency)    
    sem_man.release()
    admin.money +=koverzija
    
    db_sem_1.acquire()
    try:
        session.add(admin)
        session.commit()
        shared["database_error"]=0
        db_sem_1.release()
    except SQLAlchemyError:
        shared["database_error"]=500
        db_sem_1.release()
    
      
    
    