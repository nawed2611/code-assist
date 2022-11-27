import React, { useState, useEffect } from 'react'
import { useSpeechContext } from '@speechly/react-client';
import Editor from 'react-simple-code-editor';
import { PushToTalkButton, IntroPopup } from "@speechly/react-ui";
import axios from 'axios';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

function App() {
  const { segment, listening, attachMicrophone, start, stop } = useSpeechContext();
  const [res, setRes] = useState("");
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  useEffect(() => {
    if (segment) {
      if (segment?.isFinal) {

        const plainS = segment.words.map(word => word.value).join(' ');

        axios.post('http://localhost:5000/code', { transcripts: plainS }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then((res) => {
            setRes(res.data.answer);
          })
          .catch((err) => {
            console.log(err);
          }
          )

      }
    }
  }, [segment]);

  const handleDocs = () => {
    axios.post('http://localhost:5000/debug', { transcripts: res }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        setRes(res.concat(response.data.answer));
      })
      .catch((err) => {
        console.log(err);
      }
      )
  }

  return (
    <section className='min-h-screen'>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-purple-700 text-7xl font-bold mt-12">Code<span className='text-gray-700'>Assist</span></h1>
        <IntroPopup />
        <div className='float'>
          <PushToTalkButton />
        </div>
        <p className='py-4 h-24'>
          {segment ? segment.words.map(word => word.value).join(' ') : 'Say Something!!'}
        </p>
        {
          res ?
            <div className='w-[60vw] min-h-[60vh]'>
              <Editor
                value={res}
                onValueChange={res => setRes(res)}
                highlight={code => highlight(code, languages.js)}
                padding={16}
                className="w-full overflow-y-scroll bg-slate-100"
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 15,
                }}
              />
              <button className='bg-purple-400 text-white p-2 m-3 mb-4 rounded-lg' onClick={handleDocs}>Explain code &#8593;</button>
            </div>
            : <div className='w-[60vw] h-[60vh]'>
              <Editor
                value={code}
                onValueChange={res => setRes(res)}
                highlight={code => highlight(code, languages.js)}
                padding={16}
                className="w-full overflow-y-scroll bg-slate-100"
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 15,
                }}
              />
            </div>
        }
      </div>
    </section>
  );
}

export default App
