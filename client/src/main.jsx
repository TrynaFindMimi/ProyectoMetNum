// client/src/main.jsx
// Punto de entrada de la app React. Monta <App /> en el div#root del HTML.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
