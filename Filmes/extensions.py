# Filmes/extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Criamos as instâncias aqui, sem as ligar a nenhuma aplicação.
# Elas funcionam como "proxies" que serão configurados mais tarde.
db = SQLAlchemy()
migrate = Migrate()