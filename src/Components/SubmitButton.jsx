import React from 'react'

const SubmitButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-blue-500 text-white my-4 py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
  >
    Submit Guess
  </button>
)

export default SubmitButton
