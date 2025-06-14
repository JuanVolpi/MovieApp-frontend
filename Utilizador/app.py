import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do ficheiro .env na raiz do projeto
load_dotenv()

from .extensions import db, migrate
from .routes import api_bp


def create_app():
    """Cria e configura uma instância da aplicação Flask para o Serviço de Utilizador."""

    app = Flask(__name__)
    CORS(app)

    # --- Definir os Caminhos de Forma Explícita e Segura ---
    service_root_path = os.path.abspath(os.path.dirname(__file__))
    instance_path = os.path.join(service_root_path, 'instance')

    try:
        os.makedirs(instance_path, exist_ok=True)
    except OSError:
        pass

    # --- Configurar a Aplicação ---
    db_path = os.path.join(instance_path, 'utilizador.db')

    app.config.from_mapping(
        # Lê a chave secreta do ambiente, com um valor de fallback por segurança
        SECRET_KEY=os.environ.get('SECRET_KEY') or 'a-sua-chave-secreta-longa-e-segura-aqui',
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{db_path}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # --- Inicializar as Extensões com a App ---
    db.init_app(app)
    migrate.init_app(app, db)

    # --- Registar o Blueprint ---
    app.register_blueprint(api_bp)

    # --- Criar as Tabelas da Base de Dados ---
    with app.app_context():
        db.create_all()

    return app