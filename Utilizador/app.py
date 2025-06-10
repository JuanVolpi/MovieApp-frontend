#Utilizador/app.py
import os
from flask import Flask
from .extensions import db, migrate
from .routes import api_bp


def create_app():
    """Cria e configura uma instância da aplicação Flask para o Serviço de Utilizador."""

    app = Flask(__name__)

    # --- 1. Definir os Caminhos de Forma Explícita e Segura ---
    # `__file__` refere-se a este ficheiro (app.py)
    # `os.path.dirname` dá-nos a pasta que o contém (`Utilizador`)
    service_root_path = os.path.abspath(os.path.dirname(__file__))

    # Construímos o caminho para a pasta de instância DENTRO da pasta do serviço
    instance_path = os.path.join(service_root_path, 'instance')

    # --- 2. Garantir que a Pasta de Instância Existe ---
    # Este é o passo crucial. Criamos o diretório ANTES de o usarmos.
    try:
        os.makedirs(instance_path, exist_ok=True)
        print(f"Pasta de instância garantida em: {instance_path}")  # Mensagem de debug
    except OSError as e:
        print(f"Erro ao criar a pasta de instância: {e}")

    # --- 3. Configurar a Aplicação ---
    db_path = os.path.join(instance_path, 'utilizador.db')

    app.config.from_mapping(
        SECRET_KEY='minha-chave-secreta-de-desenvolvimento',
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{db_path}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # --- 4. Inicializar as Extensões com a App ---
    db.init_app(app)
    migrate.init_app(app, db)

    # --- 5. Registar o Blueprint ---
    app.register_blueprint(api_bp)

    # --- 6. Criar as Tabelas da Base de Dados ---
    with app.app_context():
        # Agora, quando esta linha for executada, a pasta de destino já existe.
        db.create_all()
        print(f"Tabelas da base de dados criadas/verificadas para: {db_path}")  # Mensagem de debug

    return app