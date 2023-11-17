from flask import Flask, jsonify, request, session
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.secret_key = 'your_secret_key'

eventos = [
    {"id": 1, "nome": "Rodizio de Pizzas por R$19,90", "data": "01-12-2023", "horario": "18:00", "capacidade": 50},
    {"id": 2, "nome": "Rodizio de Massas por R$29,90", "data": "06-12-2023", "horario": "19:30", "capacidade": 30},
]

reservas = []
email_acesso = None  # Adicione esta linha

@app.route('/')
def hello():
    return 'Backend do Sistema de Reservas Ativado'

@app.route('/eventos', methods=['GET'])
def listar_eventos():
    return jsonify(eventos)

# Registrar Evento
@app.route('/eventos/<int:evento_id>/registrar', methods=['POST'])
def registrar_evento(evento_id):
    global reservas, email_acesso

    evento = next((e for e in eventos if e['id'] == evento_id), None)
    if evento is None:
        return jsonify({"mensagem": "Evento não encontrado"}), 404

    # Obter o nome do usuário logado (você pode usar a variável de sessão ou outra forma de autenticação)
    email_usuario = request.json.get('emailUsuario')  # Ajuste conforme necessário

    # Verificar se o usuário já está registrado para este evento
    if any(reserva['evento']['id'] == evento_id and reserva['emailUsuario'] == email_usuario for reserva in reservas):
        return jsonify({"mensagem": "Você já está registrado para este evento."}), 400

    # Se o usuário não estiver registrado, atualize o email_acesso
    if email_acesso is None:
        email_acesso = email_usuario

    # Verificar se o email do usuário é o mesmo usado para acessar o site
    if email_usuario != email_acesso:
        return jsonify({"mensagem": "Você só pode se registrar com o mesmo email usado para acessar o site."}), 400

    reservas.append({"evento": evento, "emailUsuario": email_usuario})
    return jsonify({"mensagem": "Registro feito com sucesso!"})
# Detalhes do Evento
@app.route('/eventos/<int:evento_id>/detalhes', methods=['GET'])
def detalhes_evento(evento_id):
    evento = next((e for e in eventos if e['id'] == evento_id), None)
    if evento is None:
        return jsonify({"mensagem": "Evento não encontrado"}), 404

    detalhes = {"evento": evento, "reservas": []}

    for reserva in reservas:
        if reserva['evento']['id'] == evento_id:
            detalhes['reservas'].append({"emailUsuario": reserva['emailUsuario']})

    return jsonify(detalhes)

# Excluir Reserva
@app.route('/eventos/<int:evento_id>/excluir-reserva/<email_reserva>', methods=['DELETE'])
def excluir_reserva(evento_id, email_reserva):
    global reservas

    evento = next((e for e in eventos if e['id'] == evento_id), None)
    if evento is None:
        return jsonify({"mensagem": "Evento não encontrado"}), 404

    reservas_evento = [reserva for reserva in reservas if reserva['evento']['id'] == evento_id and reserva['emailUsuario'] == email_reserva]

    if not reservas_evento:
        return jsonify({"mensagem": "Reserva não encontrada para exclusão"}), 404

    reservas.remove(reservas_evento[0])
    return jsonify({"mensagem": "Reserva excluída com sucesso!"})

if __name__ == '__main__':
    app.run(debug=True)
