#Filmes/models.py
from .extensions import db  # Importa a instância partilhada
import json  # Usaremos json para guardar listas (estúdios, países)


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tmdb_id = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(4), nullable=True)
    director = db.Column(db.String(100), nullable=True)

    # SQLite não tem um tipo de dados para arrays, por isso guardamos como uma string JSON.
    _studios = db.Column("studios", db.Text, nullable=True)
    _countries = db.Column("countries", db.Text, nullable=True)

    overview = db.Column(db.Text, nullable=True)
    poster_path = db.Column(db.String(255), nullable=True)

    @property
    def studios(self):
        return json.loads(self._studios) if self._studios else []

    @studios.setter
    def studios(self, value):
        self._studios = json.dumps(value)

    @property
    def countries(self):
        return json.loads(self._countries) if self._countries else []

    @countries.setter
    def countries(self, value):
        self._countries = json.dumps(value)

    def to_dict(self):
        """Converte o objeto para um dicionário para ser enviado como JSON."""
        return {
            'tmdb_id': self.tmdb_id,
            'title': self.title,
            'year': self.year,
            'director': self.director,
            'studios': self.studios,
            'countries': self.countries,
            'overview': self.overview,
            'poster_url': f"https://image.tmdb.org/t/p/w500{self.poster_path}" if self.poster_path else None
        }

    @classmethod
    def find_by_tmdb_id(cls, tmdb_id):
        return cls.query.filter_by(tmdb_id=tmdb_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()