# Utilizador/app.py

import os
from flask import Flask
# Importa as instâncias partilhadas do ficheiro extensions
from .extensions import db, migrate
# Importa o blueprint das rotas
from .routes import api_bp


def create_app():
    """Cria e configura uma instância da aplicação Flask."""
    app = Flask(__name__, instance_relative_config=True)

    # --- 1. Configuração ---
    # Carrega a configuração a partir de um ficheiro (opcional, mas boa prática)
    # app.config.from_object('config.Config')

    # Ou configura diretamente como você estava a fazer:
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(app.instance_path, 'database.db')
    app.config.from_mapping(
        SECRET_KEY='minha-chave-secreta-de-desenvolvimento',
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{db_path}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Garante que a pasta 'instance' existe
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # --- 2. Inicialização das Extensões ---
    db.init_app(app)
    migrate.init_app(app, db)

    # --- 3. Registo do Blueprint ---
    app.register_blueprint(api_bp)

    # --- 4. Comandos CLI e Contexto da Aplicação ---
    with app.app_context():
        # db.create_all() é útil para criar a BD rapidamente na primeira vez.
        # Para alterações futuras, use o flask db migrate e flask db upgrade.
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5001, debug=True)