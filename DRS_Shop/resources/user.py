from flask.views import MethodView
from flask_smorest import Blueprint,abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token

from sqlalchemy.exc import SQLAlchemyError
from db import db
from models import UserModel
from schemas import UserSchema,UserSchemaRegister,UserSchemaUpdate,UserSchemaViewUpdate

blp=Blueprint("Users",__name__,description="Operations with users")


@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(UserSchema)
    def post(self,user_data):
        user=UserModel.query.filter(UserModel.email==user_data["email"]).first()
        
        if user and pbkdf2_sha256.verify(user_data["password"],user.password):
            access_token=create_access_token(identity=user.id)
            return {"access_token":access_token}
        
        abort(401,message="Invalid credentials")
        
  
@blp.route("/change")
class UserUpdate(MethodView):
    
    @blp.arguments(UserSchemaUpdate)
    @blp.response(201,UserSchemaViewUpdate)
    def put(self,user_data):
        
        user=UserModel.query.get(user_data["id"])
        userCheckE=UserModel.query.filter(UserModel.email==user_data["email"]).first()
        userCheckP=UserModel.query.filter(UserModel.password==pbkdf2_sha256.hash(user_data["password"])).first()
        
        if userCheckE.id != user.id:
            abort(409,message="A user with email already exists.")
        elif userCheckE.id != user.id:
            abort(409,message="A user with password already exists.")
            
            
        user.name=user_data["name"],
        user.surname=user_data["surname"],
        user.address=user_data["address"],
        user.city=user_data["city"],
        user.country=user_data["country"],
        user.phone=user_data["phone"],
        user.email=user_data["email"],
        user.password=pbkdf2_sha256.hash(user_data["password"])
            
        
        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,"An error occured during transaction.")
        
        return user  




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
                       password=pbkdf2_sha256.hash(user_data["password"]))
        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured while inserting the item.")
        
        return {"message":"User created successfully."},201




    
    