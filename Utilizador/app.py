import os
from flask import Flask
from flask_migrate import Migrate, upgrade
from .models import db, User
from .routes import api_bp


# Esta função irá criar a aplicação e a base de dados
def create_app():
    app = Flask(__name__)

    # --- 1. Configuração Explícita ---
    basedir = os.path.abspath(os.path.dirname(__file__))
    instance_path = os.path.join(basedir, 'instance')
    os.makedirs(instance_path, exist_ok=True)
    db_path = os.path.join(instance_path, 'database.db')

    app.config['SECRET_KEY'] = 'minha-chave-secreta-de-desenvolvimento'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- 2. Inicialização das Extensões ---
    db.init_app(app)
    migrate = Migrate(app, db)

    # --- 3. Criação da Base de Dados e Tabelas (A PARTE NOVA) ---
    with app.app_context():
        # A primeira vez que corre, isto cria o ficheiro database.db
        # e todas as tabelas definidas em models.py
        db.create_all()

        # Opcional: Para aplicar migrações automaticamente
        # Isto é mais avançado e pode ser arriscado se não for bem gerido.
        # Por agora, db.create_all() é mais seguro e simples.
        # Se a pasta 'migrations' existir, aplica as migrações.
        # if os.path.exists(os.path.join(basedir, 'migrations')):
        #     upgrade()

    # --- 4. Registo do Blueprint ---
    app.register_blueprint(api_bp)

    return app


# Bloco para correr diretamente com "python app.py"
if __name__ == '__main__':
    app = create_app()
    app.run(port=5001, debug=True)