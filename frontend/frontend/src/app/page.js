"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";
import axios from 'axios';
import SyncLoader from "react-spinners/ClipLoader";


const isValidUrl = (url) => {
  // Regular expression for URL validation
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+(?:\/[^ "]+)*$/;
  return urlPattern.test(url);
};

export default function Page() {
  const router = useRouter()

  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [selectedLlm, setSelectedLlm] = useState('gpt-4-turbo-preview');
  const [manualModel, setManualModel] = useState('');
  const [urls, setUrls] = useState([]);
  const [showLeft, setShowLeft] = useState(true); 
  const [errorMessage, setErrorMessage] = useState(null); 
  const [file, setFile] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submittedPDF, setSubmittedPDF] = useState(false);


  const handleFileChange = (event) => {
    setSubmittedPDF(false);
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmitPDF = async (event) => {
    event.preventDefault();
    if (!file) return;
    setLoadingPDF(true);
  
    const formData = new FormData();
    formData.append('pdfFile', file);
  
    try {
      const response = await fetch('http://127.0.0.1:80/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('pdfContent', data.pdfContent);
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingPDF(false);
    setSubmittedPDF(true);
  };  

  
  useEffect(() => {
    
  const storedQuestionList = sessionStorage.getItem('questionListClient');
  const storedAnswerList = sessionStorage.getItem('answerListClient');
    if (storedQuestionList){
      sessionStorage.removeItem('questionListClient');
    }
    if (storedAnswerList){
      sessionStorage.removeItem('answerListClient');
    }
  
  
    const apiKey = sessionStorage.getItem('openaiApiKey');
    if (apiKey) {
      setOpenaiApiKey(apiKey);
    }
}, []);





  const handleSubmit = async (e) => {
    setErrorMessage(null);
    setLoadingSubmit(true);
    e.preventDefault();
    
    //Remove empty strings of list


    if (urls.every(url => url.trim() === '' || !isValidUrl(url))) {
      if (!submittedPDF)
{        setErrorMessage('Please enter at least one URL or submitted document.');
        setLoadingSubmit(false);
      return;
}    
}

    const finalURLsList = urls.filter(url => url.trim() !== '');

    try {
      sessionStorage.setItem('urls', JSON.stringify(finalURLsList));

      if(manualModel==''){
        sessionStorage.setItem('selectedLLM', selectedLlm);
      }else{
        sessionStorage.setItem('selectedLLM', manualModel);
      }

      const response = await fetch('http://127.0.0.1:80', {
      
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openai_api_key: openaiApiKey,
          selected_llm: selectedLlm,
          manual_model: manualModel,
          // urls: finalURLsList,
        }),
      });
  
      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem('openaiApiKey', openaiApiKey);
        sessionStorage.setItem('chat_id', data.chat_id);
        sessionStorage.removeItem('questionListClient');
        sessionStorage.removeItem('answerListClient');

        router.push('/chat', { scroll: false })

        // Handle the data as needed, e.g., update state, display in UI, etc.
      } else {

        const data = await response.json();
        setErrorMessage(data.error_message);
        sessionStorage.removeItem('openaiApiKey', openaiApiKey);

        // Handle non-successful response
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    } finally{
      setLoadingSubmit(false);

    }

  };
  

  const handleAddUrlInput = () => {
    setUrls([...urls, '']);
  };

  const handleChangeUrl = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };

  const modelInputToggler = () => {
    setShowLeft(!showLeft); // Toggle between showing left and right divs
    const buttons = document.getElementsByClassName('toggle_button');
    for (let button of buttons) {
      if (showLeft) {
        button.textContent = 'Use Recommended Model';
      }else{
        
        button.textContent = 'Manually Enter Model (Developer Level)';

      }
    }
  };

  return (
    <div style={{ backgroundColor: '#000000' }} >





      <form onSubmit={handleSubmit}>



        {/* OpenAI API Key */}
        <div className="form-group" id='main-container' >
          <label htmlFor="openai_api_key">OpenAI API Key:</label>
          <input
            type="password"
            id="openai_api_key"
            className='input_form'
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            style={{ width: '60%' }}
          />
          <p>
            <a href="https://openai.com/product" style={{ color: 'white', fontSize: 'smaller' }}>
              Where to get it?
            </a>
          </p>
        </div>


        <div class="line"></div>

        <div style={{ margin: '20px' }}>
          {/* File input for uploading PDF */}
         
          <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="pdfFile" style={{marginRight:'10px'}}>Upload Document (optional):</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="pdfFile"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />

          </div>
        
          {loadingPDF ? (
          <SyncLoader color="#03eeff" loading={loadingPDF} size={60} />
        ) : (
          submittedPDF ? (
            <div>File Submitted Successfully</div>
          ) : (
            <button
              type="submit"
              id='button'
              className="btn btn-info"
              style={{ marginLeft: '18px', width:'25%' }}
              onClick={handleSubmitPDF}
            >
              Submit File
            </button>
          )
        )}
        </div>

        


        {/* URLs */}
        
        <div className="form-group" style={{ marginTop: '40px'}} id='main-container'>
            <label htmlFor="urls">Enter URLs (optional):</label>
            <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        className='input_form'
                        value={urls[0]}
                        onChange={(e) => handleChangeUrl(0, e.target.value)}
                        placeholder='https://example.com'
                        // style={{ width: '40%' }}
                    />
                </div>
                <div style={{ margin: '20px' }}>
                    <button type="button" id='button' className="btn btn-info" onClick={handleAddUrlInput} >
                        More URLs
                    </button>
                </div>
            </div>
            {urls.slice(1).map((url, index) => (
                <div key={index} style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        className='input_form'
                        value={url}
                        onChange={(e) => handleChangeUrl(index + 1, e.target.value)}
                        placeholder='https://example.com'

                    />
                </div>
            ))}

        </div>

        </div>

        <div class="line"></div>

        {/* Language Model */}
        
        <div style={{ display: 'flex', alignItems: 'center' }} id='main-container' > 

        {showLeft &&
        (<div className="form-group">
          <label htmlFor="selected_llm">Language Model:</label>
          <select
            className="form-select"
            name="selected_llm"
            id="selected_llm"
            value={selectedLlm}
            onChange={(e) => setSelectedLlm(e.target.value)}
            style={{ width: '400px', marginRight: '30px' }}
          >
            <option value="gpt-4-turbo-preview">GPT 4 (gpt-4-turbo-preview) - Recommended</option>
            <option value="gpt-4">GPT 4 (gpt-4)</option>
            <option value="gpt-3.5-turbo">GPT 3.5 (gpt-3.5-turbo) - Cost Effective</option>
            <option value="gpt-3.5-turbo-0125">GPT 3.5 (gpt-3.5-turbo-0125) - Cost Effective</option>

          </select>
          <p style={{ marginTop: '10px' }}>
            <a href="https://openai.com/pricing" style={{ color: 'white', fontSize: 'smaller' }}>
              Which one to choose?
            </a>
          </p>
        </div>)}

        

        {/* Manual Model */}
       {!showLeft &&( <div className="form-group">
          <label htmlFor="manual_model">Enter Open AI model name:</label>
          <input
            type="text"
            name="manual_model"
            className='input_form'
            id="manual_model"
            value={manualModel}
            onChange={(e) => setManualModel(e.target.value)}
            placeholder="e.g. gpt-4-0125-preview"
            style={{ width: '250px' }}
          />
          <p style={{ marginTop: '10px' }}>
            <a href="https://platform.openai.com/docs/models/overview" style={{ color: 'white', fontSize: 'smaller' }}>
              List of supported models
            </a>
          </p>
        </div>)}
        <button type="button"  id='button' className="toggle_button" onClick={modelInputToggler} style={{ width: '30%' }}>
              Manually Enter Model (Developer Level)
            </button>
        </div>

        {/* Submit Button */}
        <div style={{ margin: '40px', textAlign: 'center' }} >
        {loadingSubmit ? (
          <SyncLoader color="#03eeff" loading={loadingSubmit} size={60} />
        ) : (
          <button type="submit" id='button' className="btn btn-info" 
          style={{ width: '50%', border: errorMessage ? '5px solid #ff1f1f' : 'none' }}
          >
        Let's Start
        </button>
        )}

        </div>



      </form>
      <div>
      {/* Display error message if exists */}
      {errorMessage && (
        <>
          <h2 id='errorMessage' >Error</h2>
          <p id='errorMessageDesc'>{errorMessage}</p>
        </>
      )}
      <form onSubmit={handleSubmit}>
        {/* Rest of your form */}
      </form>
    </div>
    </div>
  );
}
