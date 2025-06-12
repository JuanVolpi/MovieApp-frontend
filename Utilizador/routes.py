# Utilizador/routes.py

from flask import request, jsonify, Blueprint
from .models import User

api_bp = Blueprint('api', __name__, url_prefix='/api')


# --- ROTAS DE REGISTO, LOGIN E DADOS BÁSICOS ---

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

    return jsonify({'message': 'Login bem-sucedido!', 'user': user.to_dict()})


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


# --- ROTAS DE RESET DE PASSWORD ---

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
        return jsonify({'message': 'Se o email existir, um link de reset foi enviado.', 'test_token': token})

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


# --- NOVOS ENDPOINTS PARA GERIR FOLLOWERS E FOLLOWING ---

@api_bp.route('/users/<int:user_id>/follow', methods=['POST'])
def follow_user(user_id):
    """Endpoint para o utilizador <user_id> seguir outro utilizador."""
    data = request.get_json()
    if 'user_to_follow_id' not in data:
        return jsonify({'error': 'Falta o "user_to_follow_id"'}), 400

    user_who_is_following = User.find_by_id(user_id)
    user_to_be_followed = User.find_by_id(data['user_to_follow_id'])

    if not user_who_is_following or not user_to_be_followed:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    if user_who_is_following.id == user_to_be_followed.id:
        return jsonify({'error': 'Um utilizador não se pode seguir a si mesmo'}), 400

    if user_who_is_following.is_following(user_to_be_followed):
        return jsonify({'message': 'Já segue este utilizador'}), 200

    user_who_is_following.follow(user_to_be_followed)

    return jsonify({'message': f"Agora segue {user_to_be_followed.username}"}), 200


@api_bp.route('/users/<int:user_id>/unfollow', methods=['POST'])
def unfollow_user(user_id):
    """Endpoint para o utilizador <user_id> deixar de seguir outro."""
    data = request.get_json()
    if 'user_to_unfollow_id' not in data:
        return jsonify({'error': 'Falta o "user_to_unfollow_id"'}), 400

    user_who_is_unfollowing = User.find_by_id(user_id)
    user_to_be_unfollowed = User.find_by_id(data['user_to_unfollow_id'])

    if not user_who_is_unfollowing or not user_to_be_unfollowed:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    if not user_who_is_unfollowing.is_following(user_to_be_unfollowed):
        return jsonify({'message': 'Não segue este utilizador'}), 200

    user_who_is_unfollowing.unfollow(user_to_be_unfollowed)

    return jsonify({'message': f"Deixou de seguir {user_to_be_unfollowed.username}"}), 200


# --- NOVOS ENDPOINTS PARA OBTER AS LISTAS ---

@api_bp.route('/users/<int:user_id>/following', methods=['GET'])
def get_following(user_id):
    """Obtém a lista de utilizadores que um determinado utilizador segue."""
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    following_list = [u.to_dict() for u in user.followed]
    return jsonify(following_list)


@api_bp.route('/users/<int:user_id>/followers', methods=['GET'])
def get_followers(user_id):
    """Obtém a lista de seguidores de um determinado utilizador."""
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    followers_list = [u.to_dict() for u in user.followers]
    return jsonify(followers_list)