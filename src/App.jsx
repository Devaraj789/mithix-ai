import React from 'react'
import { AccessibleDialog } from './components/AccessibleDialog'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Application</h1>
        <p>Accessible Dialog Example</p>
        <AccessibleDialog />
      </header>
    </div>
  )
}

export default App