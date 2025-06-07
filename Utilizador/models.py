from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """MODELO: Representa a tabela de utilizadores."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Converte o objeto para um dicionário para ser serializado em JSON."""
        return {'id': self.id, 'username': self.username, 'email': self.email}

    # --- INÍCIO DA IMPLEMENTAÇÃO DO PADRÃO DAO ---
    @classmethod
    def find_by_username(cls, username):
        """Método DAO: Encontra um utilizador pelo seu username."""
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, user_id):
        """Método DAO: Encontra um utilizador pelo seu ID."""
        return cls.query.get(user_id)

    def save_to_db(self):
        """Método DAO: Guarda a instância atual (novo ou alterado) na base de dados."""
        db.session.add(self)
        db.session.commit()
    # --- FIM DA IMPLEMENTAÇÃO DO PADRÃO DAO ---