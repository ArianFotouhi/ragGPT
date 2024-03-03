from flask import Blueprint
from flask import Blueprint, request, jsonify
import slate3k as slate
from io import BytesIO


upload_bp = Blueprint('upload', __name__)


@upload_bp.route('/upload', methods=['POST'])  
def upload():
    if 'pdfFile' not in request.files:
        return jsonify({'error': 'No file part'})

    pdf_file = request.files['pdfFile']
    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        pdf_content = BytesIO(pdf_file.read())

        pdf_content.seek(0)

        text = slate.PDF(pdf_content).text()

        return jsonify({'pdfContent': text})
    except Exception as e:
        return jsonify({'error': str(e)})
