import React, { useState, useEffect } from 'react'
import { useSpeechContext } from '@speechly/react-client';
import { PushToTalkButton, IntroPopup } from "@speechly/react-ui";
import axios from 'axios';
import Layout from './layout';


function App() {
  const { segment, listening, attachMicrophone, start, stop } = useSpeechContext();
  const [transcripts, setTranscripts] = useState("");
  const [res, setRes] = useState("");

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.map(word => word.value).join(' ');

      if (segment.isFinal) {
        // Handle speech segment and make permanent changes to app state
        setTranscripts(plainString);

        axios.post('http://localhost:5000/code', { transcripts }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            console.log(res.data);
            setRes(res.data.answer);
          }
          )
          .catch(err => {
            console.log(err);
          })
      }
    }

  }, [segment]);

  return (
    <section className='overflow-hidden h-screen'>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold pt-11 mt-11">CodeAssist</h1>
        <IntroPopup />
        <button className='p-4' onClick={attachMicrophone}>Initialize microphone</button>
        <PushToTalkButton />
        <p className='py-4'>
          {segment && segment.words.map(word => word.value).join(' ')}
        </p>
        <div className='py-4'>
          {transcripts && <p>You Said - <em>{transcripts}</em></p>}
        </div>
        <div className='px-11 mx-11 py-4'>
          {
            res && <p>Answer - <em>{res}</em></p>
          }
        </div>
      </div>
    </section>
  );
}

export default App
