import React from 'react'

const Header = ({ daily }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-center mb-4">
      <span className="text-pano">Pano</span>dle
    </h1>
    <h2 className="text-xl text-center">{daily? "Daily Run" : "Random Run"}</h2>

    {!daily && <div className="my-2 text-center">
      <p className="text-sm italic">
        This run's progress will not be saved between sessions or to your run history
      </p>
    </div>}
  </div>
)

export default Header
