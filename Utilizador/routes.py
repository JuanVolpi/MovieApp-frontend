# ServicoUtilizador/routes.py
from flask import request, jsonify, Blueprint
from .models import User

# 1. Cria o objeto Blueprint.
# 'api' é o nome do blueprint.
# __name__ ajuda o Flask a localizar recursos como templates.
# url_prefix adiciona '/api' antes de todas as rotas deste blueprint.
api_bp = Blueprint('api', __name__, url_prefix='/api')


# 2. Associa as rotas ao Blueprint usando @api_bp.route()
@api_bp.route('/users/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Faltam os campos username e password'}), 400

    if User.find_by_username(data['username']):
        return jsonify({'error': 'Esse username já existe'}), 409

    new_user = User(username=data['username'], email=data.get('email'))
    new_user.set_password(data['password'])
    new_user.save_to_db()

    return jsonify({'message': 'Utilizador criado com sucesso!', 'user': new_user.to_dict()}), 201


@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'Utilizador não encontrado'}), 404

    return jsonify(user.to_dict())