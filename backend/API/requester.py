import requests
domain = "http://127.0.0.1:80"

def ask_question(question, chat_id, urls):
    url = f'{domain}/chat'
    payload = {'question': question, 'chat_id': chat_id, 'urls':urls}
    headers = {
        'Content-Type': 'application/json',
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()['response']
    else:
        return f"Error: {response.status_code}, {response.text}"

def starter():
    url = f'{domain}/start'


    response = requests.get(url)

    if response.status_code == 200:
        return response.json()['chat_id']
    else:
        return f"Error: {response.status_code}, {response.text}", None

if __name__ == '__main__':
    sources = ['https://github.com/ArianFotouhi']
    chat_id = starter()
    print(chat_id)
    while True:
        user_question = input('Ask me: ')
        
        if user_question.lower() in ['exit', 'quit']:
            break

        response = ask_question(user_question,chat_id,sources)
        print(f"Bot: {response}")