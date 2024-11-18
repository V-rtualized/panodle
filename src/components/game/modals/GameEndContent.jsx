import React from 'react'

const GameEndContent = ({ targetRun, daily }) => (
  <>
    <div className="mb-4 text-center">
      <p className="text-lg">
        The run was: <span className="font-bold">{targetRun.name}</span>
      </p>
    </div>
    {!daily && (
      <div className="mb-6 text-center">
        <p className="text-sm italic">
          This was a random run, it will not be saved to your history
        </p>
      </div>
    )}
  </>
)

export default GameEndContent