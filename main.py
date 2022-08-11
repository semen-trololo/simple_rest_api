# pip install flask-restful
# pip install Flask-HTTPAuth
from flask import Flask, jsonify, abort
from flask import make_response
from flask import request
import os
app = Flask(__name__)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.route('/api/v1.0/git', methods=['GET'])
#@auth.login_required
def get_tasks():
    dir_rep = []
    patch = []
    tmp = os.listdir('git\\')
    for i in tmp:
        if os.path.isfile(os.sep.join(['git', i])):
            pass
        else:
            dir_rep.append(i)
            patch.append(os.sep.join(['git', i]))
    return jsonify({'repositories': dir_rep, 'patch': patch}) # jsonify(key1=value1 ,key2=value2 ,key3=value3)


@app.route('/api/v1.0/git/<string:repositories>', methods=['GET'])
#@auth.login_required
def get_task(repositories):
    tmp = os.listdir('git\\')
    for i in tmp:
        if i == repositories:
            tmp = os.listdir(os.sep.join(['git', i]))
            return jsonify({'dir_list': tmp})
    abort(404)


@app.route('/api/v1.0/git', methods=['POST'])
#@auth.login_required
def create_repositories():
    print(request.json)
    if not request.json or not 'name' in request.json:
        abort(400)
    if os.path.isdir(os.sep.join(['git', request.json['name']])):
        abort(400)
    os.mkdir(os.sep.join(['git', request.json['name']]))
    dir_rep = []
    patch = []
    tmp = os.listdir('git')
    for i in tmp:
        if os.path.isfile(os.sep.join(['git', i])):
            pass
        else:
            dir_rep.append(i)
            patch.append(os.sep.join(['git', i]))
    return jsonify({'repositories': dir_rep, 'patch': patch}), 201


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
#@auth.login_required
def delete_task(task_id):
    for id in tasks:
        if id['id'] == task_id:
            tasks.remove(id)
            return jsonify({'result': True})
    abort(404)
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
