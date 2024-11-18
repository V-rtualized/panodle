import React from 'react'
import { Dices, Undo2 } from 'lucide-react'
import BaseModal from './BaseModal'
import ModalButton from './ModalButton'
import GameEndContent from './GameEndContent'

const LossModal = ({ isOpen, onClose, targetRun, daily, doRandomRun }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Game Over!">
      <div className="mb-4 text-center">
        <p className="text-lg mb-2">
          You've reached the maximum number of guesses.
        </p>
      </div>

      <GameEndContent targetRun={targetRun} daily={daily} />

      <div className="mb-4 text-center space-y-4">
        {!daily && (
          <ModalButton
            onClick={() => window.location.reload()}
            icon={Undo2}
          >
            Back to Daily
          </ModalButton>
        )}

        <ModalButton
          onClick={() => {
            onClose()
            doRandomRun()
          }}
          icon={Dices}
        >
          Play Random Run
        </ModalButton>
      </div>
    </BaseModal>
  )
}

export default LossModal