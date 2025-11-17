import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# --- Configurações do Servidor de E-mail ---
MAIL_HOST = os.getenv("MAIL_HOST")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USER = os.getenv("MAIL_USER")
MAIL_PASS = os.getenv("MAIL_PASS")
MAIL_FROM = os.getenv("MAIL_FROM")

# --- Inicialização do Flask ---
app = Flask(__name__)

# --- Mapeamento de Status para Templates e Assuntos ---
STATUS_EMAIL_MAP = {
    "pendente": {
        "subject": "✅ Pedido Recebido: #{}",
        "template": "pendente.html"
    },
    "em_preparo": {
        "subject": "👨‍🍳 Pedido em Preparação: #{}",
        "template": "em_preparo.html"
    },
    "entregue": {
        "subject": "🎉 Pedido Entregue: #{}",
        "template": "entregue.html"
    }
}

def send_status_email(receiver_email: str, subject: str, html_body: str):
    """Função genérica para enviar e-mails usando STARTTLS."""
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = MAIL_FROM
    message["To"] = receiver_email
    message.attach(MIMEText(html_body, "html"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(MAIL_HOST, MAIL_PORT) as server:
            server.starttls(context=context)
            server.login(MAIL_USER, MAIL_PASS)
            server.sendmail(MAIL_FROM, receiver_email, message.as_string())
        print(f"E-mail enviado com sucesso para {receiver_email} com assunto: {subject}")
        return True
    except Exception as e:
        print(f"Falha ao enviar e-mail para {receiver_email}: {e}")
        return False

@app.route('/api/notify-order-status', methods=['POST'])
def notify_order_status():
    """
    Endpoint para receber uma atualização de status e enviar um e-mail.
    Formato esperado do JSON:
    {
        "order_id": "12345",
        "user_email": "cliente@example.com",
        "user_name": "João",
        "status": "em_preparo"
    }
    """
    data = request.get_json()

    # --- Validação da Requisição ---
    if not data:
        return jsonify({"error": "Requisição inválida. Corpo JSON não encontrado."}), 400

    required_fields = ["order_id", "user_email", "user_name", "status"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios ausentes. É necessário: {required_fields}"}), 400

    order_id = data["order_id"]
    user_email = data["user_email"]
    user_name = data["user_name"]
    status = data["status"]

    # --- Lógica de Envio de E-mail ---
    if status not in STATUS_EMAIL_MAP:
        return jsonify({"error": f"Status '{status}' inválido. Válidos: {list(STATUS_EMAIL_MAP.keys())}"}), 400

    email_info = STATUS_EMAIL_MAP[status]
    subject = email_info["subject"].format(order_id)
    
    # Renderiza o template HTML com os dados do pedido
    html_body = render_template(
        email_info["template"], 
        user_name=user_name, 
        order_id=order_id
    )

    # Envia o e-mail
    success = send_status_email(user_email, subject, html_body)

    if success:
        return jsonify({"message": f"Notificação para o status '{status}' enviada com sucesso."}), 200
    else:
        return jsonify({"error": "Ocorreu um erro interno ao tentar enviar o e-mail."}), 500

if __name__ == '__main__':
    # Executa o servidor Flask. O modo debug recarrega o servidor a cada alteração.
    # Não use debug=True em produção.
    app.run(debug=True, port=5001)