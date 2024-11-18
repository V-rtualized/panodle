import React from 'react'
import { XIcon } from 'lucide-react'

const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-slate-100 dark:bg-slate-800 rounded-lg p-6 max-w-md w-full relative ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default BaseModal