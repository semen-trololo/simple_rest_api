# pip install flask-restful
# pip install Flask-JWT-Extended
# pip install Flask-Cors

from flask import Flask, jsonify, abort
from flask import make_response
from flask import request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_cors import CORS
from urllib.parse import urlparse
from configparser import ConfigParser
import os, subprocess
# Загруска переменных среды из конфига.
env = ConfigParser()
env.read('config.ini')

ENV_PATCH = env['config']['PATCH']
ENV_USER = env['config']['USER']
ENV_PASSWORD = env['config']['PASSWORD']
app = Flask(__name__)
app.config["JSONIFY_MIMETYPE"] = "application/json; charset=utf-8"
jwt = JWTManager(app)
# enable CORS
CORS(app)
# JWT Config
app.config["JWT_SECRET_KEY"] = env['config']['JWT_SECRET_KEY']


def uri_validator(x):
    try:
        result = urlparse(x)
        return all([result.scheme, result.netloc])
    except:
        return False


def list_files_repo(path):
    tmp = []
    for entry in os.scandir(path):
        if entry.is_dir():
            if entry.name != '.git':
                tmp_dict = {
                "name": entry.name,
                "type": "dir",
                "items": list_files_repo(os.sep.join([path, entry.name]))
                }
                tmp.append(tmp_dict)
        elif entry.is_file():
            tmp_dict = {
            "name": entry.name,
            "type": "file",
            "items": []
        }
            tmp.append(tmp_dict)
        elif entry.is_symlink():
            pass
    return tmp


def discovery_path(path):
    try:
        list_dir = os.scandir(os.sep.join([ENV_PATCH, path]))
    except:
        abort(404)
    tmp = []
    for entry in list_dir:
        if entry.is_dir():
            if entry.name != '.git':
                tmp_dict = {
                "name": entry.name,
                "dir": True,
                "path" : os.sep.join([path, entry.name])
                }
                tmp.append(tmp_dict)
        elif entry.is_file():
            tmp_dict = {
            "name": entry.name,
            "dir": False,
            "path": ""
        }
            tmp.append(tmp_dict)
        elif entry.is_symlink():
            pass
    return tmp


def delete_dir(path, oswin):
    """deletes the path entirely"""
    if oswin:
        cmd = "RMDIR " + path + " /s /q"
    else:
        cmd = "rm -rf " + path
    return subprocess.getstatusoutput(cmd)


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
    if request.json or 'user' in request.json or 'password' in request.json:
        user = request.json["user"]
        password = request.json["password"]
    else:
        abort(400)
        #user = request.form["user"]
        #password = request.form["password"]

    if user == ENV_USER and password == ENV_PASSWORD:
        access_token = create_access_token(identity=user, expires_delta=False)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(message="Bad User or Password"), 401



@app.route('/api/v1.0/git', methods=['GET'])
#@jwt_required()
def get_list_git():
    #response = flask.jsonify({'some': 'data'})
    #response.headers.add('Access-Control-Allow-Origin', '*')

    return jsonify(repositories=list_files_repo(ENV_PATCH)) # jsonify(key1=value1 ,key2=value2 ,key3=value3)


@app.route('/api/v1.0/clone', methods=['POST'])
@jwt_required()
def create_clone():
    if not request.json or not 'url' in request.json:
        abort(400)
    if len(request.json['url']):
        if uri_validator(request.json['url']):
            url = request.json['url']
            try:
                subprocess.check_output(['git', 'clone', str(url)], cwd=ENV_PATCH)
            except subprocess.CalledProcessError:
                abort(500)
            return jsonify(repositories=discovery_path("")), 201
        else:
            abort(400)
    else:
        abort(400)


@app.route('/api/v1.0/git/<string:name>', methods=['DELETE'])
@jwt_required()
def delete_repositorie(name):
    tmp = os.listdir(ENV_PATCH)
    if name in tmp:
        error = delete_dir(os.sep.join([ENV_PATCH, name]), False)
        if error[0] != 0:
            abort(500)
        return jsonify(repositories=discovery_path(""))
    abort(404)


@app.route('/api/v1.0/pull', methods=['POST'])
@jwt_required()
def pull_repositorie():
    if not request.json or not 'name' in request.json:
        abort(400)
    else:
        tmp = os.listdir(ENV_PATCH)
        if request.json['name'] not in tmp:
            abort(404)
        else:
            try:
                cmd = os.sep.join([ENV_PATCH, request.json['name']])
                out = subprocess.check_output(['git', 'pull'], cwd=cmd)
                out = out.decode('utf-8', errors='ignore')
            except subprocess.CalledProcessError:
                abort(500)
            return jsonify(message=out)

        
@app.route('/api/v1.0/discovery', methods=['POST'])
@jwt_required()
def discovery_list():
    if not request.json or not 'path' in request.json:
        abort(400)
    tmp = {"repositories": discovery_path(str(request.json['path'])}
    path = {"path": request.json['path']}
    return jsonify(tmp, path), 200


if __name__ == '__main__':
    #app.run(debug=True, host='0.0.0.0', ssl_context=('ssl/cert.pem', 'ssl/key.pem'))
    app.run(debug=True, host='0.0.0.0')
