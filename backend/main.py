from flask import Flask
from flask_cors import CORS
from API.application.database import ChatDatabase
from API.application.endpoints.chat import chat_bp
from API.application.endpoints.index import index_bp
from API.application.endpoints.upload_file import upload_bp

import warnings
warnings.filterwarnings('ignore')




database = ChatDatabase()
database.create_table()

app = Flask(__name__)
CORS(app)


#/
app.register_blueprint(index_bp)
#/chat
app.register_blueprint(chat_bp)
#/upload
app.register_blueprint(upload_bp)




if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=80)