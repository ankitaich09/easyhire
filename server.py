from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/data/<path:path>')
def serve_data(path):
    return send_from_directory('data', path)

if __name__ == '__main__':
    app.run(debug=True)
