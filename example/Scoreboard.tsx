import React, { useState, useEffect } from 'react'

export default ({ scores }) => (
  <div  className="scoreboard">
    <div className="title">Highest scores</div>
      <div className="scores">
        {scores.map((record, index) => (
          <div key={record.id}>
            <div>{index + 1}. {record.name}</div>
            <div>{record.score}</div>
          </div>
        ))}
      </div>
  </div>
)
