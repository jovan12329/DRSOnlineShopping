from flask.views import MethodView
from flask_smorest import Blueprint,abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token,jwt_required,get_jwt,get_jwt_identity
from flask import jsonify
from mail_notify import send_mail

from sqlalchemy.exc import SQLAlchemyError
from db import db
from models import UserModel,BlockListModel,CardModel
from schemas import UserSchema,UserSchemaRegister,UserSchemaUpdate,UserSchemaViewUpdate,CardSchema,CardSchemaUnverified,VerifiedSchema

blp=Blueprint("Users",__name__,description="Operations with users")


@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(UserSchema)
    def post(self,user_data):
        user=UserModel.query.filter(UserModel.email==user_data["email"]).first()
        
        if user and user_data["password"]==user.password:
            access_token=create_access_token(identity=user.id)
            return {"access_token":access_token}
        
        abort(401,message="Invalid credentials")
        
  
@blp.route("/change")
class UserUpdate(MethodView):
    
    @jwt_required()
    @blp.arguments(UserSchemaUpdate)
    @blp.response(201,UserSchemaViewUpdate)
    def put(self,user_data):
        
        user=UserModel.query.get(user_data["id"])
        userCheckE=UserModel.query.filter(UserModel.email==user_data["email"]).first()
        #userCheckP=UserModel.query.filter(UserModel.password==pbkdf2_sha256.hash(user_data["password"])).first()
        
        if userCheckE and userCheckE.id != user.id:
            abort(409,message="A user with email already exists.")
        
            
            
        user.name=user_data["name"]
        user.surname=user_data["surname"]
        user.address=user_data["address"]
        user.city=user_data["city"]
        user.country=user_data["country"]
        user.phone=user_data["phone"]
        user.email=user_data["email"]
        user.password=user_data["password"]
            
        
        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,"An error occured during transaction.")
        
        return user  


@blp.route("/logout")
class UserLogOut(MethodView):
    @jwt_required()
    def post(self):
        jti=get_jwt()["jti"]
        blc=BlockListModel(token=jti)

        try:
            db.session.add(blc)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured while inserting the item.")
        
       
        
        return {"message":"Successfully logged out."},201


#Register Blueprints
@blp.route('/register')
class UserRegister(MethodView):
    @blp.arguments(UserSchemaRegister)
    def post(self,user_data):
        if UserModel.query.filter(UserModel.email==user_data["email"]).first():
            abort(409,message="A user with email already exists.")
        
        user=UserModel(name=user_data["name"],
                       surname=user_data["surname"],
                       address=user_data["address"],
                       city=user_data["city"],
                       country=user_data["country"],
                       phone=user_data["phone"],
                       email=user_data["email"],
                       password=user_data["password"])
        
        try:
            db.session.add(user)
            db.session.commit()
            message=f"User with username {user_data["email"]} has registered."
            send_mail(f"Registration {user_data["email"]}",message,"drsprodavnica@gmail.com")
        except SQLAlchemyError:
            abort(500,message="An error occured while inserting the item.")
        
        return {"message":"User created successfully."},201


@blp.route("/current")
class CurrentUser(MethodView):
    
    @jwt_required()
    @blp.response(200,UserSchemaViewUpdate)
    def get(self):
        jwt=get_jwt_identity()

        user=UserModel.query.get(jwt)
        
        return user




@blp.route("/verify")
class CardVerify(MethodView):
     
    @jwt_required()
    @blp.arguments(CardSchema)
    def post(self,card_data):
         
        userId=card_data["userId"]
        cardNumber=card_data["cardNumber"]
         
        user=CardModel.query.filter(CardModel.id==userId).first()
        card=CardModel.query.filter(CardModel.cardNumber==cardNumber).first()
        if user:
            abort(400,message="You have alreday sent verification for card.")
        
        if card:
            abort(400,message="The card number already exists.")

        usr=UserModel.query.get(userId)
        
        
        
        cardSessoion=CardModel(userId=userId,
                               email=usr.email,
                               cardNumber=cardNumber,
                               money=0.0,
                               currency="USD",
                               verified=False)
         
        try:
            db.session.add(cardSessoion)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured while inserting the item.")
        
        return {"message":"Verification sent."},201
    
    
    @jwt_required()
    @blp.arguments(VerifiedSchema)
    def put(self,verify_id):
        
        jwt=get_jwt_identity()
        
        if jwt!=1:
            abort(401,message="Admin privilege required.")
       
        user=CardModel.query.filter(CardModel.userId==verify_id["userId"]).first()
        
        user.verified=True
        
        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,"An error occured during transaction.")
        
        return {"message":"User verified successfully."},200
       
    @jwt_required()
    @blp.response(200,CardSchemaUnverified(many=True))
    def get(self):
        
        jwt=get_jwt_identity()
        
        if jwt!=1:
            abort(401,message="Admin privilege required.")
        
        users=CardModel.query.filter(CardModel.verified==False)
        
        return users
        
        
         
    
    