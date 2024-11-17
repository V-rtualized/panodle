import { XIcon, Dices, Undo2 } from 'lucide-react'

const LossModal = ({ isOpen, onClose, targetRun, daily, doRandomRun }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 max-w-md w-full relative">
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

        {!daily && 
        <div className="mb-6 text-center">
          <p className="text-sm italic">
            This was a random run, it will not be saved to your history
          </p>
        </div>}

        <div className="mb-4 text-center space-y-4">
          {!daily && <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 bg-panolighter dark:bg-panodarker hover:bg-pano dark:hover:bg-pano text-white mr-2`}
          >
            <div className="flex text-center gap-2">
              <Undo2 size={20} className="mt-0.5" />
              Back to Daily
            </div>
          </button>}

          <button
            onClick={() => {onClose();doRandomRun()}}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 bg-panolighter dark:bg-panodarker hover:bg-pano dark:hover:bg-pano text-white`}
          >
            <div className="flex text-center gap-2">
              <Dices size={20} className="mt-0.5" />
              Play Random Run
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LossModal
