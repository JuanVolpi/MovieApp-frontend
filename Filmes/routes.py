#Filmes/routes.py
from flask import request, jsonify, Blueprint
from .models import db, Movie # Import db para as migrações
from .tmdb_client import tmdb_client

api_bp_filmes = Blueprint('api_filmes', __name__, url_prefix='/api')

@api_bp_filmes.route('/movies/search', methods=['GET'])
def search_movies():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Parâmetro "query" em falta'}), 400

    results = tmdb_client.search_movies(query)
    # A pesquisa devolve uma lista simplificada, o que é bom para a página de resultados.
    return jsonify(results)

@api_bp_filmes.route('/movies/<int:tmdb_id>', methods=['GET'])
def get_movie_details(tmdb_id):
    # 1. Tenta encontrar o filme na nossa base de dados local
    movie = Movie.find_by_tmdb_id(tmdb_id)
    if movie:
        print(f"Filme {tmdb_id} encontrado na cache da BD.")
        return jsonify(movie.to_dict())

    # 2. Se não existir, vai buscar os detalhes completos ao TMDB
    print(f"Filme {tmdb_id} não encontrado na cache. A ir buscar ao TMDB...")
    full_details = tmdb_client.get_full_movie_details(tmdb_id)
    if not full_details:
        return jsonify({'error': 'Filme não encontrado no TMDB'}), 404

    # 3. Guarda o novo filme na nossa base de dados
    new_movie = Movie(
        tmdb_id=full_details['tmdb_id'],
        title=full_details['title'],
        year=full_details['year'],
        director=full_details['director'],
        studios=full_details['studios'], # O setter trata da conversão para JSON
        countries=full_details['countries'], # O setter trata da conversão para JSON
        overview=full_details['overview'],
        poster_path=full_details['poster_path']
    )
    new_movie.save_to_db()
    print(f"Filme {tmdb_id} guardado na cache da BD.")

    return jsonify(new_movie.to_dict()), 200