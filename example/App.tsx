import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

import * as api from './api'
import Game from '../src/Game'
import Scoreboard from './Scoreboard'
import ScoreModal from './ScoreModal'
import CurrentScore from './CurrentScore'

export default function App() {
  const [scores, setScores] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [name, setName] = useState('')
  const [score, setScore] = useState(0)

  const gameRef = useRef(null)
  const initializeGame = useCallback(canvas => {
    const game = new Game(canvas)
    gameRef.current = game
    game.start()
    game.gameOverSubject.subscribe(score => {
      game.stop()
      setGameOver(true)
      setScore(score)
    })
    game.scoreSubject.subscribe(score => {
      setScore(score)
    })
  }, [])

  useEffect(() => {
    api.scoresSubject.subscribe(setScores)
  }, [])

  async function submitScore() {
    const game = gameRef.current
    game.reset()
    game.start()
    setGameOver(false)
    await api.addScore({
      name,
      score
    })
  }

  return (
    <div className="main-container">
      <div>
        <canvas ref={initializeGame} />
        <CurrentScore score={score} />
      </div>
      <Scoreboard scores={scores} />
      {gameOver && (
        <ScoreModal
          name={name}
          setName={setName}
          score={score}
          onSubmit={submitScore}
        />
      )}
    </div>
  )
}
