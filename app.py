from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)  # allows your HTML page to send requests to this server

# ===== DATABASE CONNECTION SETTINGS =====
db_config = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv ("root1234"),   # your MySQL root password
    "database": "portfolio_db"
}

# ===== EMAIL NOTIFICATION SETTINGS =====
GMAIL_ADDRESS = os.getenv ("riokiruba58@gmail.com")        # the Gmail account sending the alert
GMAIL_APP_PASSWORD = os.getenv ("jixgqjbvkpgcynuy")   # the App Password you just generated (no spaces)
NOTIFY_EMAIL = os.getenv ("riokiruba58@gmail.com")          # where YOU want to receive the alert (can be same as above)


def send_notification_email(name, email, message):
    """Sends an email to you whenever someone submits the contact form."""
    subject = f"New Portfolio Message from {name}"
    body = f"""
You received a new message from your portfolio website!

Name: {name}
Email: {email}
Message:
{message}
"""

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = GMAIL_ADDRESS
    msg['To'] = NOTIFY_EMAIL

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.send_message(msg)
        print("📧 Notification email sent successfully!")
    except Exception as e:
        print(f"⚠ Email failed to send: {e}")


@app.route('/submit-message', methods=['POST'])
def submit_message():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({"status": "error", "message": "All fields are required"}), 400

        # Save to MySQL (same as before)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = "INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)"
        values = (name, email, message)
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()

        print(f"✅ New message saved from {name} ({email})")

        # NEW: send yourself an email notification
        send_notification_email(name, email, message)

        return jsonify({"status": "success", "message": "Message saved successfully!"}), 200

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)