import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# База данных
users_db = [{"email": "test@mail.com", "first_name": "Иван", "last_name": "Иванов"}]
messages_db = [
    {"id": 1, "user": "Женя", "text": "Всем привет", "likes": 567},
    {"id": 2, "user": "Нина", "text": "Отличная трансляция!", "likes": 12}
]

# Получаем адрес сервера из переменных окружения или ставим заглушку
BASE_URL = os.environ.get('BACKEND_URL', 'http://127.0.0.1:5000')

@app.route('/api/videos', methods=['GET'])
def get_videos():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
    videos = []
    for idx, filename in enumerate(files, start=1):
        videos.append({
            "id": idx,
            "title": filename.split('.')[0],
            "url": f"{BASE_URL}/api/videos/{filename}"
        })
    return jsonify(videos), 200

@app.route('/api/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files: return jsonify({"error": "Нет файла"}), 400
    file = request.files['video']
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        return jsonify({"message": "Загружено"}), 200
    return jsonify({"error": "Ошибка"}), 400

@app.route('/api/videos/<filename>', methods=['GET'])
def serve_video(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, mimetype='video/mp4')

# --- ЧАТ И ПОЛЬЗОВАТЕЛИ ---
@app.route('/api/chat', methods=['GET'])
def get_messages(): return jsonify(messages_db), 200

@app.route('/api/chat', methods=['POST'])
def send_message():
    data = request.get_json()
    new_msg = {"id": len(messages_db) + 1, "user": data.get('user', 'Аноним'), "text": data.get('text'), "likes": 0}
    messages_db.append(new_msg)
    return jsonify(new_msg), 200

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    users_db.append({"email": data['email'], "first_name": data['first_name'], "last_name": data['last_name']})
    return jsonify({"message": "Успешно"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = next((u for u in users_db if u['email'] == data.get('email')), None)
    return jsonify({"user": user}) if user else jsonify({"error": "Нет"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)