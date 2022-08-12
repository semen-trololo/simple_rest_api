# pip install flask-restful
#pip install Flask-JWT-Extended

from flask import Flask, jsonify, abort
from flask import make_response
from flask import request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token

from urllib.parse import urlparse
import os

app = Flask(__name__)
jwt = JWTManager(app)

# JWT Config
app.config["JWT_SECRET_KEY"] = "this-is-secret-key"

def uri_validator(x):
    try:
        result = urlparse(x)
        return all([result.scheme, result.netloc])
    except:
        return False


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify(message='Not found'), 404)

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify(message='Bad Request'), 400)

@app.route("/api/v1.0/login", methods=["POST"])
def login():
    if request.is_json:
        user = request.json["user"]
        password = request.json["password"]
    else:
        user = request.form["user"]
        password = request.form["password"]

    if user == 'test':
        access_token = create_access_token(identity=user)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad User or Password"), 401


@app.route("/dashboard")
@jwt_required()
def dasboard():
    return jsonify(message="Welcome! to the Data Science Learner")


@app.route('/api/v1.0/git', methods=['GET'])
#@auth.login_required
def get_tasks():
    dir_rep = []
    patch = []
    tmp = os.listdir('git')
    for i in tmp:
        if os.path.isfile(os.sep.join(['git', i])):
            pass
        else:
            dir_rep.append(i)
            patch.append(os.sep.join(['git', i]))
    return jsonify(repositories=dir_rep, patch=patch) # jsonify(key1=value1 ,key2=value2 ,key3=value3)


@app.route('/api/v1.0/git/<string:repositories>', methods=['GET'])
def get_dir_rep(repositories):
    tmp = os.listdir('git')
    for i in tmp:
        if i == repositories:
            tmp = os.listdir(os.sep.join(['git', i]))
            return jsonify(dir_list=tmp)
    abort(404)

@app.route('/api/v1.0/clone', methods=['POST'])
def create_clone():
    if not request.json or not 'clone' in request.json:
        abort(400)

    if len(request.json['clone']):
        f = open('clone.log', 'r')
        tmp = f.readlines()
        f.close()
        if (request.json['clone'] + '\n') not in tmp:
            if uri_validator(request.json['clone']):
                url = request.json['clone']
                cmd = 'cd git' + ' &' + ' git clone ' + str(url)
                error = os.system(cmd)
                if error:
                    f.close()
                    abort(500)
                f = open('clone.log', 'a+')
                f.write(request.json['clone'] + '\n')
                f.close()
            else:
                abort(400)
        else:
            abort(400)
    else:
        abort(400)

    dir_rep = []
    patch = []
    tmp = os.listdir('git')
    for i in tmp:
        if os.path.isfile(os.sep.join(['git', i])):
            pass
        else:
            dir_rep.append(i)
            patch.append(os.sep.join(['git', i]))
    return jsonify(repositories=dir_rep, patch=patch), 201


@app.route('/api/v1.0/git', methods=['POST'])
def create_repositories():
    print(request.json)
    if not request.json or not 'name' in request.json:
        abort(400)
    if os.path.isdir(os.sep.join(['git', request.json['name']])):
        abort(400)
    try:
        os.mkdir(os.sep.join(['git', request.json['name']]))
    except:
        abort(500)
    cmd = 'cd ' + os.sep.join(['git', request.json['name']]) + ' &' + ' git init' # or for linux <;>
    error = os.system(cmd)
    if error:
        os.rmdir(os.sep.join(['git', request.json['name']]))
        abort(500)
    dir_rep = []
    patch = []
    tmp = os.listdir('git')
    for i in tmp:
        if os.path.isfile(os.sep.join(['git', i])):
            pass
        else:
            dir_rep.append(i)
            patch.append(os.sep.join(['git', i]))
    return jsonify(repositories=dir_rep, patch=patch), 201


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    for id in tasks:
        if id['id'] == task_id:
            tasks.remove(id)
            return jsonify({'result': True})
    abort(404)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
