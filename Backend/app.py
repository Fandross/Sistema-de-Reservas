from flask import Flask, jsonify, request, session
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta, timezone
import os
import secrets


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Configure a extensão Session
app.config['SESSION_TYPE'] = 'filesystem'
# session(app)


# Defina as chaves secretas a partir das variáveis de ambiente ou gere novas se não estiverem definidas
app.secret_key = os.getenv('FLASK_SECRET_KEY', secrets.token_hex(16))
JWT_SECRET = os.getenv('JWT_SECRET', secrets.token_urlsafe(32))

usuarios = [
    {"email": "admin", "password": "admin"}
]
eventos = [
    {"id": 1, "nome": "Rodizio de Pizzas por R$19,90", "data": "01-12-2023", "horario": "18:00", "capacidade": 50},
    {"id": 2, "nome": "Rodizio de Massas por R$39,90", "data": "06-12-2023", "horario": "19:30", "capacidade": 30},
    {"id": 3, "nome": "Rodizio de Molhos por R$29,90", "data": "03-12-2023", "horario": "20:30", "capacidade": 100},
    
]

# Função para verificar e criar o usuário admin se não existir
def check_and_create_admin_user():
    admin_exists = any(user['email'] == 'admin' for user in usuarios)
    
    if not admin_exists:
        # Se o usuário admin não existir, cria-o
        usuarios.append({"email": "admin", "password": "admin"})

# Rota para verificar e criar o usuário admin
@app.route('/usuarios/admin', methods=['GET'])
def check_admin_user():
    check_and_create_admin_user()
    return jsonify({'message': 'Usuário admin verificado/criado com sucesso'})

# Função para gerar um token JWT
def generate_jwt(email):
    expiration_time = datetime.now(timezone.utc) + timedelta(hours=1)  # Token expira em 1 hora
    payload = {'email': email, 'exp': expiration_time}
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

# Verifica as credenciais (substitua por sua lógica de autenticação real)
def verify_credentials(email, password):
    return email == 'seu_email' and password == 'sua_senha'

# Autentica o usuário e retorna o email autenticado
def authenticate_user(email, password):
    user = next((user for user in usuarios if user['email'] == email), None)
    
    if user and user['password'] == password:
        return email
    else:
        return None

# Rota de login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    authenticated_email = authenticate_user(email, password)

    if authenticated_email:
        # Gera o token JWT após autenticação bem-sucedida
        token = generate_jwt(authenticated_email)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'mensagem': 'Credenciais inválidas'}), 401

# Rota de cadastro
@app.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Verifique se o usuário já existe
    if usuario_existe(email):
        return jsonify({'mensagem': 'Usuário já cadastrado'}), 400

    # Adicione o novo usuário à lista de usuários
    adicionar_usuario(email, password)

    # Gera o token JWT após o cadastro bem-sucedido
    token = generate_jwt(email)

    return jsonify({'mensagem': 'Cadastro realizado com sucesso!', 'token': token}), 200



# Função para verificar se o usuário já existe
def usuario_existe(email):
    return any(usuario['email'] == email for usuario in usuarios)

# Função para adicionar um novo usuário
def adicionar_usuario(email, password):
    usuarios.append({'email': email, 'password': password})
reservas = []
email_acesso = None  # Adicione esta linha

@app.route('/')
def hello():
    return 'Backend do Sistema de Reservas Ativado'

@app.route('/eventos', methods=['GET'])
def listar_eventos():
    return jsonify(eventos)

# Listar Reservas
@app.route('/reservas', methods=['GET'])
def listar_reservas():
    return jsonify(reservas)

# Registrar Evento
@app.route('/eventos/<int:evento_id>/registrar', methods=['POST'])
def registrar_evento(evento_id):
    global reservas

    evento = next((e for e in eventos if e['id'] == evento_id), None)
    if evento is None:
        return jsonify({"mensagem": "Evento não encontrado"}), 404

    # Obter o nome do usuário logado (você pode usar a variável de sessão ou outra forma de autenticação)
    email_usuario = request.json.get('emailUsuario')  # Ajuste conforme necessário

    # Verificar se o usuário já está registrado para este evento
    if any(reserva['evento']['id'] == evento_id and reserva['emailUsuario'] == email_usuario for reserva in reservas):
        return jsonify({"mensagem": "Você já está registrado para este evento."}), 400

    # Se o usuário não estiver registrado, atualize o email_acesso na sessão
    if 'email_acesso' not in session:
        session['email_acesso'] = email_usuario

    # Verificar se o email do usuário é o mesmo usado para acessar o site
    if email_usuario != session['email_acesso']:
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
