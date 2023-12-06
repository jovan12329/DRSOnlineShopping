from marshmallow import Schema,fields


class UserSchemaRegister(Schema):
    id=fields.Int(dump_only=True)
    email=fields.Str(required=True)
    username=fields.Str(required=True)
    password=fields.Str(required=True,load_only=True)
    
class UserSchema(Schema):
    id=fields.Int(dump_only=True)
    username=fields.Str(required=True)
    password=fields.Str(required=True,load_only=True)