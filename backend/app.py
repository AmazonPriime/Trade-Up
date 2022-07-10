from flask import Flask
from flask_cors import CORS
from flask import request
import json
import ast
import os

if not os.path.exists('./scores.json'):
    open('scores.json', 'w').close()

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
        return json.dumps(scores)

    if request.method == 'POST':
        data = request.get_data(as_text=True)
        data = ast.literal_eval(data)

        if data.get('value') is None:
            return 'Invalid format - missing "value"', 422
        try:
            float(data.get('value'))
        except ValueError:
            return 'Value needs to be a number'
        if float(data.get('value')) < 100:
            return 'Invalid score - needs to be at least £100.00', 422

        if data.get('id') is None:
            return 'Invalid format - missing "ID"', 422

        if data.get('name') is None:
            return 'Invalid format - missing "name"', 422
        if len(data.get('name')) < 2:
            return 'Name is too short', 422

        if data.get('trades') is None:
            return 'Invalid format - missing "trades"', 422
        try:
            int(data.get('trades'))
        except ValueError:
            return 'Trades needs to be a number', 422

        if data.get('time') is None:
            return 'Invalid format - missing "time"', 422
        try:
            int(data.get('time'))
        except ValueError:
            return 'Time needs to be a number (seconds)', 422

        score = {
            'id': data.get('id'),
            'name': data.get('name'),
            'time': data.get('time'),
            'trades': data.get('trades')
        }

        scores = []
        with open('./scores.json') as f:
            try:
                scores = json.load(f)
            except json.decoder.JSONDecodeError:
                pass
        scores.append(score)
        with open('./scores.json', 'w') as f:
            json.dump(scores, f)

        return 'Score submitted!', 200

    return 'Something went wrong.', 500
