import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Симулируем базу данных пользователей
users_db = [
    {"email": "test@mail.com", "first_name": "Иван", "last_name": "Иванов"}
]

# АВТОМАТИЧЕСКОЕ ВОССТАНОВЛЕНИЕ СПИСКА ВИДЕО ИЗ ПАПКИ UPLOADS
videos_db = []
if os.path.exists(UPLOAD_FOLDER):
    # Читаем все файлы из папки и оставляем только видео-расширения
    saved_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
    for idx, filename in enumerate(saved_files, start=1):
        videos_db.append({
            "id": idx,
            "title": filename.split('.')[0], # Имя файла без расширения в качестве названия
            "url": f"http://127.0.0.1:5000/api/videos/{filename}"
        })

# Сообщения чата
messages_db = [
    {"id": 1, "user": "Женя", "text": "Всем привет", "likes": 567},
    {"id": 2, "user": "Нина", "text": "Отличная трансляция!", "likes": 12}
]

@app.route('/')
def home():
    return jsonify({"message": "Бэкенд YADRO готов!"})

# --- РЕГИСТРАЦИЯ ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    last_name = data.get('last_name')
    first_name = data.get('first_name')
    
    if not email or not last_name or not first_name:
        return jsonify({"error": "Заполните все поля"}), 400
        
    if any(u['email'] == email for u in users_db):
        return jsonify({"error": "Пользователь с такой почтой уже существует"}), 400
        
    new_user = {"email": email, "last_name": last_name, "first_name": first_name}
    users_db.append(new_user)
    return jsonify({"message": "Успешно", "user": new_user}), 200

# --- ВХОД ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Введите почту"}), 400
        
    user = next((u for u in users_db if u['email'] == email), None)
    
    if user:
        return jsonify({"message": "Вход разрешен", "user": user}), 200
    else:
        return jsonify({"error": "Пользователь с такой почтой не зарегистрирован!"}), 404

# --- ЧАТ ---
@app.route('/api/chat', methods=['GET'])
def get_messages():
    return jsonify(messages_db), 200

@app.route('/api/chat', methods=['POST'])
def send_message():
    data = request.get_json()
    user = data.get('user', 'Аноним')
    text = data.get('text')
    if not text: return jsonify({"error": "Пустое сообщение"}), 400
    
    new_msg = {"id": len(messages_db) + 1, "user": user, "text": text, "likes": 0}
    messages_db.append(new_msg)
    return jsonify(new_msg), 200

# --- ВИДЕО ---
@app.route('/api/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files: return jsonify({"error": "Нет файла"}), 400
    file = request.files['video']
    title = request.form.get('title', '')
    
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        
        # Если название не ввели, берем имя файла
        display_title = title if title.strip() else file.filename.split('.')[0]
        
        video_info = {
            "id": len(videos_db) + 1, 
            "title": display_title, 
            "url": f"http://127.0.0.1:5000/api/videos/{file.filename}"
        }
        videos_db.append(video_info)
        return jsonify(video_info), 200

@app.route('/api/videos', methods=['GET'])
def get_videos(): 
    return jsonify(videos_db), 200

@app.route('/api/videos/<filename>', methods=['GET'])
def serve_video(filename): 
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)