from flask import Blueprint
from flask import Blueprint, request, jsonify
from API.application.database import ChatDatabase
from langchain_openai import OpenAIEmbeddings


index_bp = Blueprint('index', __name__)


@index_bp.route('/', methods=['POST'])
def index():
    
        database = ChatDatabase()
        database.create_table()
        data = request.json
        open_ai_key = data['openai_api_key']
        
        selected_llm = data['selected_llm']
        if selected_llm:
            selected_llm = data['manual_model']

        # Generate a unique chat ID
        chat_id = database.generate_unique_id()

        # Check if the generated chat ID is unique in the database
        while database.check_id_exists(chat_id):

            chat_id = database.generate_unique_id()
        try:
            #to test api key 
            embeddings = OpenAIEmbeddings(openai_api_key = open_ai_key)
            embeddings.embed_query('hi') 
            return jsonify({'chat_id': chat_id, 'error_message':None}), 200
        except Exception as e:      
             e = e.__dict__
             print(e)
             print(type(e))
             return jsonify({'chat_id': None, 'error_message':e['body']['message']}), 500
