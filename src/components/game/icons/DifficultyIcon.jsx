import React from 'react'
import { ReactComponent as Circle } from '@piste-icons/svg/circle.svg'
import { ReactComponent as Square } from '@piste-icons/svg/square.svg'
import { ReactComponent as Diamond } from '@piste-icons/svg/diamond.svg'
import { ReactComponent as DDiamond } from '@piste-icons/svg/double_diamond.svg'

const DIFFICULTY_COLORS = {
  Green: '#339933',
  Blue: '#006699',
  Black: '#000000',
}

const DifficultyIcon = ({ difficulty, stroke }) => {
  switch (difficulty) {
    case 'Blue':
      return (
        <Square
          alt={'Ski difficulty'}
          fill={DIFFICULTY_COLORS['Blue']}
          stroke={stroke || 'white'}
          height={20}
          style={{
            marginTop: 5,
            marginRight: 3,
          }}
        />
      )
    case 'Black':
      return (
        <Diamond
          alt={'Ski difficulty'}
          fill={DIFFICULTY_COLORS['Black']}
          stroke={stroke || 'white'}
          height={20}
          style={{
            marginTop: 5,
            marginRight: 3,
          }}
        />
      )
    case 'Double Black':
      return (
        <DDiamond
          alt={'Ski difficulty'}
          fill={DIFFICULTY_COLORS['Black']}
          stroke={stroke || 'white'}
          height={20}
          style={{
            marginTop: 5,
            marginRight: 3,
          }}
        />
      )
    default:
      return (
        <Circle
          alt={'Ski difficulty'}
          fill={DIFFICULTY_COLORS['Green']}
          stroke={stroke || 'white'}
          height={20}
          style={{
            marginTop: 5,
            marginRight: 3,
          }}
        />
      )
  }
}

export default DifficultyIcon
