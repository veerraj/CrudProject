from flask import Flask

from flask_pymongo import PyMongo

from flask_cors import CORS

from bson.json_util import dumps

from bson.objectid import ObjectId

from flask import jsonify,request

from werkzeug.security import generate_password_hash,check_password_hash

app = Flask(__name__)

CORS(app)
# app.secret.key="secretkey"

app.config['MONGO_URI']="mongodb://localhost:27017/User"

mongo=PyMongo(app)

if __name__=="__main__":
    app.run(debug=True)

@app.route('/users')
def get_users():
    users=mongo.db.users.find()
    resp= dumps(users)
    return resp

@app.route('/users/<user_id>')
def getuserbyid(user_id):
    user=mongo.db.users.find_one({'_id':ObjectId(user_id)})
    resp=dumps(user)
    return resp

@app.route('/delete/<user_id>',methods=['DELETE'])
def deleteUser(user_id):
    user=mongo.db.users.delete_one({'_id':ObjectId(user_id)})
    resp=jsonify("User deleted Successfully")
    resp.status_code=200
    return resp


@app.route('/update/<user_id>',methods=['PUT'])
def updateUser(user_id):
    _id=user_id
    _json=request.json
    _name=_json['name']
    _email=_json['email']
    _password=_json['pwd']

    if _name and _email and _password and request.method=='PUT':
        _hashed_password=generate_password_hash(_password)

        mongo.db.users.update_one({'_id':ObjectId(_id['$old']) if '$old'in _id else ObjectId(_id)},{'$set':{'name':_name,'email':_email,'pwd':_hashed_password}})

        resp=jsonify("User updated Successfully")

        resp.status_code=200

        return resp
    else:
        return not_found()

@app.route('/add',methods=['Post'])
def add_user():
    _json=request.json
    _name=_json['name']
    _email=_json['email']
    _password=_json['pwd']

    if _name and _email and _password and request.method=='POST':
        _hashed_password=generate_password_hash(_password)

        id=mongo.db.users.insert({'name':_name,'email':_email,'pwd':_hashed_password})

        resp=jsonify("User added Successfully")

        resp.status_code=200

        return resp
    else:
        return not_found()

@app.errorhandler(404)
def not_found(error=None):
    message={
        'status':'404',
        'message':'Not found '+request.url
    }
    resp = jsonify(message)

    resp.status_code=404

    return resp
