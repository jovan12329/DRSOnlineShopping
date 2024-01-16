from os import environ
import secrets

from flask import Flask,jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from db import db
import models

from resources.user import blp as UserBlueprint
from resources.product import blp as ProductBlueprint
from resources.payment import blp as PaymentBlueprint
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
    
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header,jwt_payload):
        blocklist=models.BlockListModel.query.all()
        lst=[el.token for el in blocklist]
        return jwt_payload["jti"] in lst
    
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header,jwt_payload):
        return(
            jsonify(
            {"description":"The token has been revoked","error":"token_revoked"}
            ),401,
               
        )
    
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header,jwt_payload):
        return(
            jsonify({"message":"The token has expired.","error":"invalid_token"}),401,
        )
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return(
            jsonify({"message":"Signature verification failed.","error":"invalid_token"}),401,
        )
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify({"description":"The token has expired.","error":"authorization_required"}),401,
        )
    
    
    
    with app.app_context():
        db.create_all()
    
    api.register_blueprint(UserBlueprint)
    api.register_blueprint(ProductBlueprint)
    api.register_blueprint(PaymentBlueprint)
    
    
    return app
