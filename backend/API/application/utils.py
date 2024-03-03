from bs4 import BeautifulSoup
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
import requests
# from langchain.llms import HuggingFaceHub
from langchain_openai import OpenAIEmbeddings
# from langchain_openai import ChatOpenAI
import requests
from bs4 import BeautifulSoup
import PyPDF2
import io

def initVectorDB(urls, pdf_content, api_key):
    if pdf_content:
        text = pdf_content +'\n\n\n\n\n\n\n\n\n\n\n\n\n\n'
    else:
        text = ''

    if urls:    
        for url in urls:
            try:
                text += extract_text_from_url(url)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching URL {url}: {e}")

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    # print('TEXTTTTTTTTTTT')
    # print(text)
    chunks = text_splitter.split_text(text)
    embeddings = OpenAIEmbeddings(openai_api_key = api_key) 
    knowledge_base = FAISS.from_texts(chunks, embeddings)  

    return knowledge_base


def extract_text_from_html(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        page_text = soup.get_text()
        return page_text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching HTML content from URL {url}: {e}")
        return ""

def extract_text_from_pdf(url):
    try:
        proxies = {
            'http': None,  # Bypass HTTP proxy
            'https': None,  # Bypass HTTPS proxy
        }
        
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}
        response = requests.get(url, headers=headers, proxies=proxies)
        response.raise_for_status()
        with io.BytesIO(response.content) as f:
            text = ""
            pdf_reader = PyPDF2.PdfReader(f)
            for page_num in range(len(pdf_reader.pages)):
                text += pdf_reader.pages[page_num].extract_text()
        return text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching PDF content from URL {url}: {e}")
        return None


def extract_text_from_url(url):
    if url.endswith(".pdf"):
        return extract_text_from_pdf(url)
    else:
        return extract_text_from_html(url)


