#Utilizador/routes.py
from flask import request, jsonify, Blueprint, current_app
from .models import User
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps

# Cria o objeto Blueprint para organizar as rotas
api_bp = Blueprint('api', __name__, url_prefix='/api')


def token_required(f):
    """Decorator para verificar se o token JWT é válido."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Procura o token no cabeçalho Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # O formato esperado é "Bearer <token>"
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Formato de token inválido. Use "Bearer <token>".'}), 401

        if not token:
            return jsonify({'error': 'Token de autenticação em falta'}), 401

        try:
            # Decodifica o token usando a mesma SECRET_KEY do servidor
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.find_by_id(int(data['sub']))

            if not current_user:
                return jsonify({'error': 'Token inválido - utilizador não encontrado'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        # Passa o objeto do utilizador atual para a função da rota
        return f(current_user, *args, **kwargs)

    return decorated


@api_bp.route('/users/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Faltam os campos username e password'}), 400

    if User.find_by_username(data['username']):
        return jsonify({'error': 'Esse username já existe'}), 409

    new_user = User(username=data['username'], email=data.get('email'))
    new_user.set_password(data['password'])
    new_user.save_to_db()

    return jsonify({'message': 'Utilizador criado com sucesso!', 'user': new_user.to_dict()}), 201


@api_bp.route('/users/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Faltam os campos username e password'}), 400

    user = User.find_by_username(data['username'])
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Credenciais inválidas'}), 401

    # Criação do token JWT com o payload corrigido
    token_payload = {
        'sub': str(user.id),
        'username': user.username, 
        'email': user.email,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }

    access_token = jwt.encode(
        token_payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return jsonify({
        'message': 'Login bem-sucedido!',
        'access_token': access_token,
        'user': user.to_dict(),
        'expires_in': 86400  # 24 horas em segundos
    })


@api_bp.route('/users/refresh', methods=['POST'])
@token_required
def refresh_token(current_user):
    """Gera um novo token para o utilizador autenticado."""
    token_payload = {
        'sub': str(current_user.id),
        'username': current_user.username,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }

    new_token = jwt.encode(
        token_payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return jsonify({
        'message': 'Token renovado com sucesso!',
        'access_token': new_token,
        'expires_in': 86400
    })


@api_bp.route('/users/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Obtém o perfil do utilizador autenticado a partir do seu token."""
    return jsonify({'user': current_user.to_dict()})


@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404
    return jsonify(user.to_dict())


@api_bp.route('/users/username/<string:username>', methods=['GET'])
def get_user_by_username(username):
    user = User.find_by_username(username)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404
    return jsonify(user.to_dict())


@api_bp.route('/users/reset_password_request', methods=['POST'])
def reset_request():
    data = request.get_json()
    if 'email' not in data:
        return jsonify({'error': 'Email em falta'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user:
        token = user.get_reset_token()
        print(f"--- SIMULADOR DE EMAIL PARA {user.email} ---")
        print(f"Token de reset: {token}")
        print("--- FIM DO SIMULADOR ---")
        return jsonify({
            'message': 'Se o email existir, um link de reset foi enviado.',
            'test_token': token
        })

    return jsonify({'message': 'Se o email existir, um link de reset foi enviado.'})


@api_bp.route('/users/reset_password/<token>', methods=['POST'])
def reset_token(token):
    user = User.verify_reset_token(token)
    if not user:
        return jsonify({'error': 'Token inválido ou expirado'}), 401

    data = request.get_json()
    if 'password' not in data:
        return jsonify({'error': 'Password em falta'}), 400

    user.set_password(data['password'])
    user.save_to_db()
    return jsonify({'message': 'A sua password foi alterada com sucesso!'})


@api_bp.route('/users/<int:user_id>/follow', methods=['POST'])
@token_required
def follow_user(current_user, user_id):
    """Endpoint protegido: O utilizador autenticado (current_user) segue o utilizador <user_id>."""
    if current_user.id == user_id:
        return jsonify({'error': 'Um utilizador não se pode seguir a si mesmo'}), 400

    user_to_be_followed = User.find_by_id(user_id)
    if not user_to_be_followed:
        return jsonify({'error': 'Utilizador a seguir não encontrado'}), 404

    if current_user.is_following(user_to_be_followed):
        return jsonify({'message': 'Já segue este utilizador'}), 200

    current_user.follow(user_to_be_followed)
    return jsonify({'message': f"Agora segue {user_to_be_followed.username}"}), 200


@api_bp.route('/users/<int:user_id>/unfollow', methods=['POST'])
@token_required
def unfollow_user(current_user, user_id):
    """Endpoint protegido: O utilizador autenticado (current_user) deixa de seguir o utilizador <user_id>."""
    user_to_be_unfollowed = User.find_by_id(user_id)
    if not user_to_be_unfollowed:
        return jsonify({'error': 'Utilizador a deixar de seguir não encontrado'}), 404

    if not current_user.is_following(user_to_be_unfollowed):
        return jsonify({'message': 'Não segue este utilizador'}), 200

    current_user.unfollow(user_to_be_unfollowed)
    return jsonify({'message': f"Deixou de seguir {user_to_be_unfollowed.username}"}), 200


@api_bp.route('/users/<int:user_id>/following', methods=['GET'])
def get_following(user_id):
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    following_list = [u.to_dict() for u in user.followed]
    return jsonify(following_list)


@api_bp.route('/users/<int:user_id>/followers', methods=['GET'])
def get_followers(user_id):
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    followers_list = [u.to_dict() for u in user.followers]
    return jsonify(followers_list)