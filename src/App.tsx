import React, { useState, useEffect } from 'react'
import { useSpeechContext } from '@speechly/react-client';
import {
  PushToTalkButton,
  IntroPopup
} from "@speechly/react-ui";

import axios from 'axios';

function App() {
  const { segment, listening, attachMicrophone, start, stop } = useSpeechContext();
  const [transcripts, setTranscripts] = useState("");

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
          }
          )
          .catch(err => {
            console.log(err);
          })
      }
    }

  }, [segment]);

  return (
    <div className="bg-black text-white">
      <IntroPopup />
      <button className='p-4' onClick={attachMicrophone}>Initialize microphone</button>
      <PushToTalkButton />
      <p>
        {segment && segment.words.map(word => word.value).join(' ')}
      </p>
      <div>
        {transcripts && <p>You Said - <em>{transcripts}</em></p>}
      </div>
    </div>
  );
}

export default App
