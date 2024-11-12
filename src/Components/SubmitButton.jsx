import React from 'react'

const SubmitButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-panolighter dark:bg-panodarker hover:bg-pano dark:hover:bg-pano text-white my-4 py-2 px-4 rounded-lg disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:cursor-not-allowed"
  >
    Submit Guess
  </button>
)

export default SubmitButton
