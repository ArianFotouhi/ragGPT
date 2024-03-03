"use client"
import { useState, useEffect } from "react";
import './styles.css'
import Link from 'next/link'
import SyncLoader from "react-spinners/ClipLoader";

export default function Page() {
    const [question, setQuestion] = useState('');
    const [selectedLLM, setSelectedLLM] = useState('');

    const [loading, setLoading] = useState(false);

    const [questionListClient, setQuestionListClient] = useState([])
    const [answerListClient, setAnswerListClient] = useState([])
    
    
    const [errorMessage, setErrorMessage] = useState(null); 

    useEffect(() => {
      // Retrieve values from sessionStorage
      const storedQuestionList = sessionStorage.getItem('questionListClient');
      const storedAnswerList = sessionStorage.getItem('answerListClient');

      // Parse sessionStorage values or initialize as empty arrays if sessionStorage is empty
      const parsedQuestionList = storedQuestionList ? JSON.parse(storedQuestionList) : [];
      const parsedAnswerList = storedAnswerList ? JSON.parse(storedAnswerList) : [];

      // Update state variables directly
      setQuestionListClient(parsedQuestionList);
      setAnswerListClient(parsedAnswerList);

      const llm = sessionStorage.getItem('selectedLLM');
      setSelectedLLM(llm);
  }, []);




    const hanldeStartOver = async (e) => {
      try{
        sessionStorage.removeItem('selectedLLM');
        sessionStorage.removeItem('chat_id');
        sessionStorage.removeItem('urls');
        sessionStorage.removeItem('pdfContent');
      }
      finally{
        e.preventDefault();
        window.location.href = "/";

      }
  };
    const handleSubmit = async (e) => {

        setErrorMessage(null);
        
        e.preventDefault();
        setLoading(true); 

        try {
          setQuestionListClient(prevList => [...prevList, question]);
          
          // Retrieve the stored question list from sessionStorage
          const storedQuestionListString = sessionStorage.getItem('questionListClient');
          // Parse the stored question list string, or initialize as an empty array if it's null or empty
          const storedQuestionList = storedQuestionListString ? JSON.parse(storedQuestionListString) : [];

          // Push the new question to the question list
          storedQuestionList.push(question);

          // Store the updated question list back into sessionStorage
          try {
            sessionStorage.setItem('questionListClient', JSON.stringify(storedQuestionList));
          } catch (error) {
            console.error('Error storing question list in sessionStorage:', error);
          }
          
          let pdfContent = null;
          try{
            pdfContent = sessionStorage.getItem('pdfContent');
            
          } catch(error){

          }

          setQuestion(''); // Clear the input field
          const response = await fetch('http://127.0.0.1:80/chat', {
          
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                open_ai_key: sessionStorage.getItem('openaiApiKey'),
                selected_llm: selectedLLM,
                urls: JSON.parse(sessionStorage.getItem('urls')),
                chat_id: sessionStorage.getItem('chat_id'),
                pdf_content: pdfContent, 
            }),
          });
      

          if (response.ok) {

            const data = await response.json();
            
            setAnswerListClient(prevList => [...prevList, data.llm_response]);



          // Retrieve the stored question list from sessionStorage
          const storedAnswerListString = sessionStorage.getItem('answerListClient');
          // Parse the stored question list string, or initialize as an empty array if it's null or empty
          const storedAnswerList = storedAnswerListString ? JSON.parse(storedAnswerListString) : [];

          // Push the new question to the question list
          storedAnswerList.push(data.llm_response);

          // Store the updated question list back into sessionStorage
          try {
            sessionStorage.setItem('answerListClient', JSON.stringify(storedAnswerList));
          } catch (error) {
            console.error('Error storing question list in sessionStorage:', error);
          }






        } else {
          const data = await response.json();
          setErrorMessage(data.error_message)

            // Handle non-successful response
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          // Handle error
        }
        finally {
          setLoading(false); 
      }
      };
  
      

return(
    <div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Link href="/" id='button' className="start_over_button" onClick={hanldeStartOver}>Start Over</Link>
      <h6 style={{ marginLeft: 'auto' }}>Model Name: {selectedLLM}</h6>
    </div>




      <form onSubmit={handleSubmit}>


      <>
    {questionListClient.length === 0 ? (
      <div>

      </div>
    ) : (
      <div id='qa_container'>
        {questionListClient.map((question, index) => (
          <div key={index}>
            <div>
              <h2 id='question_text'>{question}</h2>
            </div>
            <div style={{ marginLeft: 'auto' }} id='answer_text'>
              {/* Check if answerListClient[index] exists before accessing it */}
              <h2>{answerListClient[index] ? answerListClient[index] : '...'}</h2>
            </div>
          </div>
        ))}
      </div>
    )}
  </>

                    



        <div className="form-group" id='main-container'>
            <input
                type="text"
                id="question_input"
                className='input_form'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{ width: '100%'}}
            />
        </div>

        <div id='main-container'>

        </div>
                {/* Send Button */}
                <div style={{ margin: '40px', textAlign: 'center' }}>
                {loading ? (
                    <SyncLoader color="#03eeff" loading={loading} size={60}/>
                ) : (
                    question === '' ? (
                      <button type="submit" id='unhover_button' className="btn btn-info" style={{ width: '50%' }} disabled={true}>
                      Send
                  </button>                    ) : (
                        <button type="submit" id='button' className="btn btn-info" style={{ width: '50%' }}>
                            Send
                        </button>
                    )
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
    
)
}
