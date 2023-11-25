import os
from flask.cli import FlaskGroup
from flask_migrate import Migrate
from create_app import create_app, db

app = create_app()

# Импортируйте и настройте Flask-Migrate
migrate = Migrate(app, db)

# Добавьте команды Flask-Migrate в CLI
cli = FlaskGroup(create_app=create_app)

if __name__ == "__main__":
    cli()