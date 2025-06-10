#HistoricoFilmes/routes.py
from flask import request, jsonify, Blueprint
from .models import UserMovieEntry
from datetime import date

api_bp_historico = Blueprint('api_historico', __name__, url_prefix='/api')


@api_bp_historico.route('/entries', methods=['POST'])
def add_or_update_entry():
    """
    Endpoint central para criar ou atualizar a relação de um utilizador com um filme.
    Devolve 201 Created para uma nova entrada e 200 OK para uma atualização.
    """
    data = request.get_json()
    required_fields = ['user_id', 'movie_id', 'state']
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Faltam dados obrigatórios (user_id, movie_id, state)'}), 400

    user_id = data['user_id']
    movie_id = data['movie_id']
    new_state = data['state'].upper()  # Converte para maiúsculas para consistência

    if new_state not in ['WATCHLIST', 'WATCHED']:
        return jsonify({'error': "Estado inválido. Use 'WATCHLIST' ou 'WATCHED'."}), 400

    # Procura se já existe uma entrada para este par utilizador/filme
    entry = UserMovieEntry.find_by_user_and_movie(user_id, movie_id)

    # Cria uma "flag" para saber se a entrada é nova ou se é uma atualização.
    is_new_entry = False
    if not entry:
        is_new_entry = True
        entry = UserMovieEntry(user_id=user_id, movie_id=movie_id)

    # Atualiza o estado e os dados da review se for o caso
    entry.state = new_state
    if new_state == 'WATCHED':
        # Validação para quando se marca como visto
        if 'rating' not in data or 'watch_date' not in data:
            return jsonify({'error': "Para o estado 'WATCHED', 'rating' e 'watch_date' são obrigatórios."}), 400

        try:
            # Converte a data de string para objeto date
            entry.watch_date = date.fromisoformat(data['watch_date'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Formato de data inválido. Use AAAA-MM-DD.'}), 400

        entry.rating = data['rating']
        entry.review_text = data.get('review_text')

    # Usa o método DAO para guardar as alterações na base de dados
    entry.save_to_db()

    # Usa a "flag" para devolver o código de status correto
    status_code = 201 if is_new_entry else 200

    return jsonify(entry.to_dict()), status_code


@api_bp_historico.route('/users/<int:user_id>/entries', methods=['GET'])
def get_user_entries():
    """
    Obtém todas as entradas de um utilizador.
    Pode ser filtrado por estado com um parâmetro de query, ex: ?state=WATCHLIST
    """
    state_filter = request.args.get('state', None)

    # Validação do filtro
    if state_filter and state_filter.upper() not in ['WATCHLIST', 'WATCHED']:
        return jsonify({'error': "Filtro de estado inválido. Use 'WATCHLIST' ou 'WATCHED'."}), 400

    # Converte o filtro para maiúsculas se existir
    normalized_state_filter = state_filter.upper() if state_filter else None

    # Usa o método DAO para obter as entradas
    entries = UserMovieEntry.find_all_by_user_id(user_id, state=normalized_state_filter)

    return jsonify([entry.to_dict() for entry in entries])


@api_bp_historico.route('/entries', methods=['DELETE'])
def delete_entry():
    """Endpoint para remover uma entrada (ex: remover da watchlist ou de vistos)."""
    data = request.get_json()
    if not all(key in data for key in ['user_id', 'movie_id']):
        return jsonify({'error': 'Faltam dados obrigatórios (user_id, movie_id)'}), 400

    entry = UserMovieEntry.find_by_user_and_movie(data['user_id'], data['movie_id'])

    if entry:
        entry.delete_from_db()
        return jsonify({'message': 'Entrada removida com sucesso'}), 200

    # Se a entrada não existir, não é um erro do cliente, apenas não há nada a fazer.
    # 404 é apropriado para indicar que o recurso a ser apagado não foi encontrado.
    return jsonify({'error': 'Entrada não encontrada'}), 404