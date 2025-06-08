import os
import requests
import threading


class TMDBClient:
    # ... (o __new__ e o _lock permanecem iguais) ...
    _instance = None
    _lock = threading.Lock()

    BASE_URL = "https://api.themoviedb.org/3"
    API_KEY = os.environ.get('TMDB_API_KEY')

    def __new__(cls):
        if not cls.API_KEY:
            raise ValueError("A chave da API do TMDB (TMDB_API_KEY) não foi encontrada no ambiente.")
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(TMDBClient, cls).__new__(cls)
        return cls._instance

    def _make_request(self, endpoint, params=None):
        if params is None:
            params = {}
        params['api_key'] = self.API_KEY
        params.setdefault('language', 'pt-PT')
        try:
            response = requests.get(f"{self.BASE_URL}/{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao comunicar com a API do TMDB: {e}")
            return None

    def search_movies(self, query):
        params = {'query': query}
        data = self._make_request("search/movie", params=params)
        return data['results'] if data and 'results' in data else []

    def get_full_movie_details(self, tmdb_id):
        """
        Obtém os detalhes completos de um filme, incluindo realizador, estúdios e país.
        Faz duas chamadas à API: uma para detalhes e outra para créditos.
        """
        # Chamada 1: Obter detalhes principais (título, ano, estúdios, país)
        details = self._make_request(f"movie/{tmdb_id}")
        if not details:
            return None

        # Chamada 2: Obter créditos (realizador)
        credits = self._make_request(f"movie/{tmdb_id}/credits")

        # Extrair o realizador da resposta dos créditos
        director = "N/A"
        if credits and 'crew' in credits:
            for member in credits['crew']:
                if member['job'] == 'Director':
                    director = member['name']
                    break  # Encontrámos o realizador, podemos parar

        # Extrair e formatar os dados que queremos
        year = details.get('release_date', '----').split('-')[0] if details.get('release_date') else "N/A"
        studios = [studio['name'] for studio in details.get('production_companies', [])]
        countries = [country['name'] for country in details.get('production_countries', [])]

        # Combinar tudo num único dicionário limpo
        full_details = {
            'tmdb_id': details.get('id'),
            'title': details.get('title'),
            'year': year,
            'director': director,
            'studios': studios,
            'countries': countries,
            'overview': details.get('overview'),
            'poster_path': details.get('poster_path')
        }
        return full_details


# Instância Singleton
tmdb_client = TMDBClient()