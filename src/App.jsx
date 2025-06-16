import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id='game'>
      <canvas id='canvas' width='800' height='600'></canvas>
        <div id='score'>
          <span id='playerscore'>0</span><span id='aiscore'>0</span>
          </div>    
    </div>
  )
}

export default App
