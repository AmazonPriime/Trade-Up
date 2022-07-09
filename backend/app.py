from flask import Flask
from flask_cors import CORS
from flask import request
import json
import ast

app = Flask(__name__)
CORS(app)


@app.route('/scores', methods=['GET', 'POST'])
def scores():
    if request.method == 'GET':
        scores = []
        with open('./scores.json') as f:
            try:
                scores = json.load(f)
            except json.decoder.JSONDecodeError:
                print('Score file is empty.')
        return str(scores)

    if request.method == 'POST':
        data = request.get_data(as_text=True)
        data = ast.literal_eval(data)

        if data.get('name') is None:
            return 'Invalid format'
        if len(data.get('name')) < 2:
            return 'Name is too short'

        if data.get('trades') is None:
            return 'Invalid format'
        try:
            int(data.get('trades'))
        except ValueError:
            return 'Trades needs to be a number'

        if data.get('time') is None:
            return 'Invalid format'
        try:
            int(data.get('time'))
        except ValueError:
            return 'Time needs to be a number (seconds)'

        score = {
            'name': data.get('name'),
            'time': data.get('time'),
            'trades': data.get('trades')
        }

        with open('./scores.json', 'r+') as f:
            scores = []
            try:
                scores = json.load(f)
            except json.decoder.JSONDecodeError:
                print('Score file is empty.')
            scores.append(score)
            json.dump(scores, f)

        return 'Score submitted!'

    return 'Something went wrong.'
