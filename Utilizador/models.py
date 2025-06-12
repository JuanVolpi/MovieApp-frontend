# Utilizador/models.py

from flask import current_app
from itsdangerous import URLSafeTimedSerializer as Serializer
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db

# 1. Tabela de associação para a relação muitos-para-muitos
followers = db.Table('followers',
                     db.Column('follower_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                     db.Column('followed_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
                     )


class User(db.Model):
    """MODELO: Representa a tabela de utilizadores."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)

    # 2. Relação para "quem eu sigo" (following)
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Converte o objeto para um dicionário, incluindo as contagens."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'following_count': self.following_count,  # Adiciona a contagem
            'followers_count': self.followers_count  # Adiciona a contagem
        }

    # --- NOVAS PROPRIEDADES PARA CONTAGEM ---
    @property
    def following_count(self):
        """Propriedade dinâmica que conta quantos utilizadores este utilizador segue."""
        return self.followed.count()

    @property
    def followers_count(self):
        """Propriedade dinâmica que conta quantos seguidores este utilizador tem."""
        return self.followers.count()

    # --- FIM DAS PROPRIEDADES ---

    # --- MÉTODOS DAO PARA GERIR FOLLOWS ---
    def follow(self, user_to_follow):
        """Faz com que o utilizador atual siga outro utilizador."""
        if not self.is_following(user_to_follow):
            self.followed.append(user_to_follow)
            db.session.commit()  # Apenas o commit é necessário para relações

    def unfollow(self, user_to_unfollow):
        """Faz com que o utilizador atual deixe de seguir outro utilizador."""
        if self.is_following(user_to_unfollow):
            self.followed.remove(user_to_unfollow)
            db.session.commit()

    def is_following(self, user):
        """Verifica se o utilizador atual já segue outro utilizador."""
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

    # --- FIM DOS MÉTODOS DAO PARA FOLLOWS ---

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.get(user_id)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def get_reset_token(self, expires_sec=1800):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id})

    @staticmethod
    def verify_reset_token(token, expires_sec=1800):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, max_age=expires_sec)['user_id']
        except:
            return None
        return User.query.get(user_id)