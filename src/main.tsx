import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { SpeechProvider } from "@speechly/react-client"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SpeechProvider appId="4014881a-2796-4c62-89ee-3b8d4511739e">
      <App />
    </SpeechProvider>
  </React.StrictMode>
)
