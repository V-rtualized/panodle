import { XIcon } from 'lucide-react'

const LossModal = ({ isOpen, onClose, targetRun }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Game Over!</h2>

        <div className="mb-4 text-center">
          <p className="text-lg mb-2">
            You've reached the maximum number of guesses.
          </p>
          <p className="text-lg">
            The run was: <span className="font-bold">{targetRun.Name}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LossModal
