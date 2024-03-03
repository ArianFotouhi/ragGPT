from flask import Blueprint, jsonify, request
from API.application.database import ChatDatabase
from langchain.prompts import PromptTemplate
import datetime
from langchain.memory import ConversationBufferMemory
from langchain.chains.question_answering import load_qa_chain
from API.application.utils import  initVectorDB

from langchain_openai import ChatOpenAI




chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    if request.method == 'POST':
        try:
            database = ChatDatabase()

            # Initialize Conversation Memory
            memory = ConversationBufferMemory(memory_key="chat_history", input_key="question")
            memory.human_prefix = ''
            memory.ai_prefix = ''

            data = request.json 
            question = data['question']
            api_key = data['open_ai_key']
            urls = data['urls']
            pdf_content = data['pdf_content']
            selected_llm = data['selected_llm']
            chat_id = data['chat_id']


            knowledge_base = initVectorDB(urls,pdf_content, api_key)

            

            message_history = database.fetch_table(chat_id=chat_id)
            for message in message_history:
                memory.save_context({"question": f"Human: {message[2]} \n AI: {message[3]}"}, {"output": ""})


            docs = knowledge_base.similarity_search(question)

            template = """You are a chatbot having a conversation with a human.

            Given the following extracted parts of a long document and a question, create a final answer.

            {context}

            {chat_history}
            Human: {question}
            Chatbot:"""
            llm = ChatOpenAI(openai_api_key=api_key, temperature=0, model_name= selected_llm)

            prompt = PromptTemplate(
                input_variables=["chat_history", "question", "context"], template=template
            )

            chain = load_qa_chain(llm, chain_type="stuff", memory=memory, prompt=prompt)

            response = chain({"input_documents": docs, "question": question}, return_only_outputs=True)['output_text']

            database.commit_table(chat_id=chat_id,prompt=question, response=response, datetime=str(datetime.datetime.now().timestamp()))
            return jsonify({'llm_response':response, 'error_message': None}), 200
        except Exception as e:
            # print(e)
            return jsonify({'llm_response':None, 'error_message': str(e)}), 500
