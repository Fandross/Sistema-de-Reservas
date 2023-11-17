from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Backend do Sistema de Reservas'

if __name__ == '__main__':
    app.run(debug=True)