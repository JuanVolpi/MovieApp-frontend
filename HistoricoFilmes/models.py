# HistoricoFilmes/models.py
from .extensions import db
from datetime import datetime, date


class UserMovieEntry(db.Model):
    """
    Modelo unificado que representa a relação de um utilizador com um filme.
    Pode estar no estado 'WATCHLIST' (para ver) ou 'WATCHED' (visto).
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, index=True)
    movie_id = db.Column(db.Integer, nullable=False, index=True)  # TMDB ID

    # O campo chave para diferenciar o estado
    state = db.Column(db.String(20), nullable=False, default='WATCHLIST')  # 'WATCHLIST' ou 'WATCHED'

    # Campos que só são preenchidos quando state='WATCHED'
    rating = db.Column(db.Float, nullable=True)
    review_text = db.Column(db.Text, nullable=True)
    watch_date = db.Column(db.Date, nullable=True)

    # Data em que a entrada foi criada ou atualizada
    added_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Um utilizador só pode ter uma entrada por filme (seja watchlist ou watched)
    __table_args__ = (db.UniqueConstraint('user_id', 'movie_id', name='_user_movie_uc'),)

    def to_dict(self):
        """Converte o objeto para um dicionário para a resposta da API."""
        entry_dict = {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'state': self.state,
            'added_at': self.added_at.isoformat()
        }
        # Adiciona os detalhes da review apenas se o filme foi visto
        if self.state == 'WATCHED':
            entry_dict.update({
                'rating': self.rating,
                'review_text': self.review_text,
                'watch_date': self.watch_date.isoformat() if self.watch_date else None
            })
        return entry_dict

    # --- MÉTODOS DAO ---
    def save_to_db(self):
        """Guarda ou atualiza a instância na base de dados."""
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        """Remove a instância da base de dados."""
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_user_and_movie(cls, user_id, movie_id):
        """Encontra a entrada única para um utilizador e um filme."""
        return cls.query.filter_by(user_id=user_id, movie_id=movie_id).first()

    @classmethod
    def find_all_by_user_id(cls, user_id, state=None):
        """
        Encontra todas as entradas para um utilizador.
        Opcionalmente, filtra por estado ('WATCHLIST' ou 'WATCHED').
        """
        query = cls.query.filter_by(user_id=user_id)
        if state:
            query = query.filter_by(state=state)
        return query.order_by(cls.added_at.desc()).all()