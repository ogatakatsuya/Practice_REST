from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import os
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os


app = Flask(__name__)
CORS(app)

# データベースの設定
app.config['SECRET_KEY'] = os.urandom(24)
base_dir = os.path.dirname(__file__)
database = 'sqlite:///' + os.path.join(base_dir, 'data.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_database.db'
app.config['SQLALCHEMY_DATABASE_URI'] = database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.environ.get('SECRET_KEY', 'default-secret-key')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# ユーザーモデルの定義
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    
    def __init__(self, user_id, password):
        self.user_id = user_id
        self.password = password

@app.route('/')
def hello():
    return "Hello World from Flask!"

@app.route("/login", methods=["POST"])
def login():
    user_id = request.json.get("id", None)
    password = request.json.get("password", None)

    # データベースからユーザーを取得して認証
    user = User.query.filter_by(user_id=user_id).first()
    
    if not user or user.password != password:
        return jsonify({"error": "認証失敗：無効な資格情報です"}), 401

    # アクセストークンの作成
    access_token = create_access_token(identity={"id": user.id, "user_id": user.user_id})
    return jsonify(access_token=access_token)

@app.route("/info", methods=["GET"])
@jwt_required()
def get_info(): 
    current_user = get_jwt_identity()
    # JWTトークンからユーザーIDを取得してデータベースからユーザー情報を取得
    user = User.query.get(current_user["id"])
    return jsonify({"id": user.id, "user_id": user.user_id})

@app.route("/register", methods=["POST"])
def register():
    user_id = request.json.get("id", None)
    password = request.json.get("password", None)
    
    print(user_id)
    print(password)

    # 入力値の確認
    if not user_id or not password:
        return jsonify({"error": "ユーザーIDまたはパスワードが入力されていません"}), 400
    
    existing_user = User.query.filter_by(user_id=user_id).first()
    
    if existing_user:
        return jsonify({"error": "ユーザーIDは既に使用されています"}), 400

    # 新しいユーザーの作成とデータベースへの保存
    new_user = User(user_id=user_id, password=password)
    db.session.add(new_user)
    db.session.commit()
    print("success!!!!!!!!!!")
    return jsonify({"message": "ユーザー登録が完了しました"}), 201

if __name__ == '__main__':
    app.run()
