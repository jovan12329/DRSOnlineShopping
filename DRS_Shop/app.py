from os import environ
import secrets

from flask import Flask
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from db import db
import models

from resources.user import blp as UserBlueprint
from resources.product import blp as ProductBlueprint

def create_app():
    
    app=Flask(__name__)
    
    app.config["PROPAGATE_EXCEPTIONS"]=True
    app.config["API_TITLE"]="DRS Online Shop"
    app.config["API_VERSION"]="v1"
    app.config["OPENAPI_VERSION"]="3.0.3"
    app.config["OPENAPI_URL_PREFIX"]="/"
    app.config["OPENAPI_SWAGGER_UI_PATH"]="/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"]="https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
    
    
    CORS(app)
    
    db.init_app(app)
    
    api=Api(app)
    
    app.config["JWT_SECRET_KEY"]="wefvdsgdibgfuy332"
    jwt=JWTManager(app)
    
    with app.app_context():
        db.create_all()
    
    api.register_blueprint(UserBlueprint)
    api.register_blueprint(ProductBlueprint)
    
    return app
