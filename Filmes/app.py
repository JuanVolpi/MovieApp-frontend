import os
from flask import Flask
from dotenv import load_dotenv
load_dotenv()
# Importa as instâncias partilhadas do ficheiro extensions deste serviço
from .extensions import db, migrate
# Importa o blueprint das rotas deste serviço
from .routes import api_bp_filmes

# Carrega as variáveis de ambiente do ficheiro .env na raiz do projeto
# Isto é crucial para que o os.environ.get('TMDB_API_KEY') funcione.


def create_app():
    """Cria e configura uma instância da aplicação Flask para o Serviço de Filmes."""

    app = Flask(__name__)

    # --- 1. Definir os Caminhos de Forma Explícita e Segura ---
    # `__file__` refere-se a este ficheiro (Filmes/app.py)
    # Isto garante que os caminhos são sempre relativos à pasta deste microserviço.
    service_root_path = os.path.abspath(os.path.dirname(__file__))
    instance_path = os.path.join(service_root_path, 'instance')

    # --- 2. Garantir que a Pasta de Instância Existe ---
    # Criamos o diretório ANTES de o usarmos para evitar erros.
    try:
        os.makedirs(instance_path, exist_ok=True)
    except OSError as e:
        print(f"Erro ao criar a pasta de instância para o Serviço de Filmes: {e}")

    # --- 3. Configurar a Aplicação ---
    # Usamos um nome específico para a base de dados para evitar conflitos.
    db_path = os.path.join(instance_path, 'filmes.db')

    app.config.from_mapping(
        SECRET_KEY='chave-secreta-para-o-servico-filmes', # Cada serviço pode ter a sua
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{db_path}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # --- 4. Inicializar as Extensões com a App ---
    db.init_app(app)
    migrate.init_app(app, db) # Lembre-se de configurar o Flask-Migrate

    # --- 5. Registar o Blueprint ---
    # Usamos o blueprint específico deste serviço
    app.register_blueprint(api_bp_filmes)

    # --- 6. Criar as Tabelas da Base de Dados ---
    with app.app_context():
        # Útil para a primeira execução. Para futuras alterações, use as migrações.
        db.create_all()
        print(f"Base de dados e tabelas para o Serviço de Filmes verificadas em: {db_path}")

    return app

# Este bloco permite correr o serviço diretamente com "python Filmes/app.py"
# para testes rápidos.
if __name__ == '__main__':
    app = create_app()
    app.run(port=5002, debug=True)