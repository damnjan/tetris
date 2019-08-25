import React from 'react'

export default ({ score, name = '', setName, onSubmit }) => (
  <div className="modal-container">
    <div className="modal">
      <div className="modal-header">Game over</div>
      <div>Your score: <strong>{score}</strong></div>
      <form onSubmit={event => {
        event.preventDefault()
        onSubmit()
      }}>
        <div className="name">
          Your name:
          <input autoFocus spellCheck="false" className="name-input" value={name} onChange={e => setName(e.target.value.trim())} />
        </div>
        <button type="submit" disabled={!name} className="submit-button">Submit</button>
      </form>
    </div>
  </div>
)
