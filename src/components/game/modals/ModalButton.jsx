import React from 'react'

const ModalButton = ({ onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 mx-1 rounded-lg transition-colors duration-200 bg-panolighter dark:bg-panodarker hover:bg-pano dark:hover:bg-pano text-white"
  >
    <div className="flex text-center gap-2">
      <Icon size={20} className="mt-0.5" />
      {children}
    </div>
  </button>
)

export default ModalButton