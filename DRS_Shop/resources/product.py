from flask.views import MethodView
from flask_smorest import Blueprint,abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token

from sqlalchemy.exc import SQLAlchemyError
from db import db
from models import ProductModel
from schemas import ProductSchema,ProductSchemaUpdate

blp=Blueprint("Products",__name__,description="Operations with products")



@blp.route("/product")
class ProductCreateUpdate(MethodView):
    
    @blp.response(200,ProductSchema(many=True))
    def get(self):
        return ProductModel.query.all()
    
    @blp.arguments(ProductSchemaUpdate)
    @blp.response(200,ProductSchema)
    def put(self,product_data):
        
        product=ProductModel.query.get(product_data["id"])
        
        
        product.name=product_data["name"]
        product.price=product_data["price"]
        product.currency=product_data["currency"]
        product.quantity=product_data["quantity"]
        
        
        
        try:
            db.session.add(product)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,"An error occured during transaction.")
        
        return product
    
    
    
    @blp.arguments(ProductSchema)
    @blp.response(201,ProductSchema)
    def post(self,product_data):
        
        product=ProductModel(**product_data)
        
        
        try:
            db.session.add(product)
            db.session.commit()
        except SQLAlchemyError:
            abort(500,message="An error occured while inserting the item.")
            
        return product
        









    
    