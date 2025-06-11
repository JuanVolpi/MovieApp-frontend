@echo off
REM Ativa o ambiente virtual
call venv\Scripts\activate

REM Define variáveis de ambiente
set FLASK_APP=app
set FLASK_RUN_PORT=5001

REM Inicia o Flask
python -m flask run

pause
