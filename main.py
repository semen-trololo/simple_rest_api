# pip install flask-restful
# pip install Flask-HTTPAuth
from flask import Flask, jsonify, abort
from flask import make_response
from flask import request
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()
app = Flask(__name__)

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]

@auth.get_password
def get_password(username):
    if username == 'sosed':
        return 'python3'
    return None


@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.route('/todo/api/v1.0/tasks', methods=['GET'])
@auth.login_required
def get_tasks():
    return jsonify({'tasks': tasks}) # jsonify(key1=value1 ,key2=value2 ,key3=value3)


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['GET'])
@auth.login_required
def get_task(task_id):
    for id in tasks:
        if id['id'] == task_id:
            return jsonify({'task': id})
    abort(404)


@app.route('/todo/api/v1.0/tasks', methods=['POST'])
@auth.login_required
def create_task():
    if not request.json or not 'title' in request.json:
        abort(400)
    task = {
        'id': tasks[-1]['id'] + 1,
        'title': request.json['title'],
        'description': request.json.get('description', ""),
        'done': False
    }
    tasks.append(task)
    return jsonify({'task': task}), 201


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
@auth.login_required
def delete_task(task_id):
    for id in tasks:
        if id['id'] == task_id:
            tasks.remove(id)
            return jsonify({'result': True})
    abort(404)
if __name__ == '__main__':
    app.run(debug=True)
