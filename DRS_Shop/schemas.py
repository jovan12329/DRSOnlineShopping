from marshmallow import Schema,fields


class UserSchemaRegister(Schema):
    id=fields.Int(dump_only=True)
    name=fields.Str(required=True,load_only=True)
    surname=fields.Str(required=True,load_only=True)
    address=fields.Str(required=True,load_only=True)
    city=fields.Str(required=True,load_only=True)
    country=fields.Str(required=True,load_only=True)
    phone=fields.Str(required=True,load_only=True)
    email=fields.Str(required=True,load_only=True)
    password=fields.Str(required=True,load_only=True)
    
class UserSchema(Schema):
    id=fields.Int(dump_only=True)
    email=fields.Str(required=True)
    password=fields.Str(required=True,load_only=True)