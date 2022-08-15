# pip install flask-restful
# pip install Flask-JWT-Extended

from flask import Flask, jsonify, abort
from flask import make_response
from flask import request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token

from urllib.parse import urlparse
from configparser import ConfigParser
import os
# Загруска переменных среды из конфига.
env = ConfigParser()
env.read('config.ini')

ENV_PATCH = env['config']['PATCH']
ENV_USER = env['config']['USER']
ENV_PASSWORD = env['config']['PASSWORD']
app = Flask(__name__)
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = env['config']['JWT_SECRET_KEY']


def uri_validator(x):
    try:
        result = urlparse(x)
        return all([result.scheme, result.netloc])
    except:
        return False

def git_dir_dict():
    json_rep = {}
    dir_rep = []
    tmp = os.listdir(ENV_PATCH)
    for i in tmp:
        if os.path.isfile(os.sep.join([ENV_PATCH, i])):
            pass
        else:
            dir_rep.append(i)
    for rep in dir_rep:
        tmp = os.listdir(os.sep.join([ENV_PATCH, rep]))
        json_rep[rep] = tmp
    return json_rep

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify(message='Not found'), 404)

@app.errorhandler(500)
def not_found(error):
    return make_response(jsonify(message='Error Server'), 500)

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify(message='Bad Request'), 400)

@app.route("/api/v1.0/login", methods=["POST"])
def login():
    if request.is_json or 'user' in request.json or 'password' in request.json:
        user = request.json["user"]
        password = request.json["password"]
    else:
        abort(400)
        #user = request.form["user"]
        #password = request.form["password"]

    if user == ENV_USER and password == ENV_PASSWORD:
        access_token = create_access_token(identity=user)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad User or Password"), 401

#@jwt_required()
@app.route('/api/v1.0/git', methods=['GET'])
def get_list_git():
    return jsonify(git_dir_dict()) # jsonify(key1=value1 ,key2=value2 ,key3=value3)

@jwt_required()
@app.route('/api/v1.0/clone', methods=['POST'])
def create_clone():
    if not request.json or not 'clone' in request.json:
        abort(400)
    if len(request.json['clone']):
        if uri_validator(request.json['clone']):
            url = request.json['clone']
            cmd = 'cd ' + ENV_PATCH + ' ;' + ' git clone ' + str(url)
            error = os.system(cmd)
            if error:
                abort(500)
            return jsonify(git_dir_dict()), 201
        else:
            abort(400)
    else:
        abort(400)


#@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
#def delete_task(task_id):
    #for id in tasks:
        #if id['id'] == task_id:
            #tasks.remove(id)
            #return jsonify({'result': True})
    #abort(404)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', ssl_context=('ssl/cert.pem', 'ssl/key.pem'))
#    app.run(debug=True, host='0.0.0.0')
