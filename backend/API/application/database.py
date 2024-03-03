import sqlite3
from contextlib import contextmanager
import uuid

class ChatDatabase:
    def __init__(self, db_path='API/application/database/conversation.db'):
        self.db_path = db_path
    
    @contextmanager
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
        finally:
            conn.close()

    def create_table(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS chat_history (
                    id INTEGER PRIMARY KEY,
                    chat_id TEXT,
                    prompt TEXT,
                    response TEXT,
                    datetime DATETIME
                )
            ''')

    def generate_unique_id(self):
        return str(uuid.uuid4())

    def check_id_exists(self, chat_id):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT COUNT(*) FROM chat_history WHERE chat_id = ?', (chat_id,))
            count = cursor.fetchone()[0]
            return count > 0

    def commit_table(self, chat_id, prompt, response, datetime):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO chat_history (chat_id, prompt, response, datetime) VALUES (?, ?, ?, ?)',
                           (chat_id, prompt, response, datetime))
            conn.commit()

    def fetch_table(self, query='SELECT * FROM chat_history', chat_id=''):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            if chat_id:
                query = f'SELECT * FROM chat_history WHERE chat_id = ?'
                cursor.execute(query, (chat_id,))
            else:
                cursor.execute(query)

            history = cursor.fetchall()
        return history