import React, { useEffect, useState } from 'react'
import { Clipboard, Send, Dices, Undo2 } from 'lucide-react'
import { BarChart, Bar, YAxis, Tooltip, XAxis } from 'recharts'
import { useCookies } from 'react-cookie'
import { getDateInMST } from '../../../utils/date/dateHelpers'
import BaseModal from './BaseModal'
import ModalButton from './ModalButton'
import GameEndContent from './GameEndContent'

const WinModal = ({
  isOpen,
  onClose,
  attempts,
  targetRun,
  daily,
  doRandomRun,
}) => {
  const [chartData, setChartData] = useState([])
  const [cookies] = useCookies(['panodle_attempts'])
  const [copied, setCopied] = useState(false)

  const getLast7DaysData = () => {
    const data = []
    const today = getDateInMST()
    const cookieData = cookies.panodle_attempts || {}

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const attemptsValue =
        date.toISOString().split('T')[0] === today.toISOString().split('T')[0]
          ? attempts || cookieData[dateStr] || 0
          : cookieData[dateStr] || 0

      data.push({
        date: dateStr,
        attempts: attemptsValue,
        label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      })
    }

    return data
  }

  useEffect(() => {
    if (isOpen) {
      const data = getLast7DaysData()
      setChartData(data)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cookies.panodle_attempts, attempts])

  const handleShare = async () => {
    const shareText = `I beat today's Panodle in ${attempts} attempts! Can you beat it faster?\nhttps://panodle.virtualized.dev`

    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className="text-pano">Congratulations!</span>}
    >
      <div className="mb-4 text-center">
        <p className="text-lg">
          You found the {!daily && 'random'} run in{' '}
          <span className="font-bold">{attempts}</span> attempts!
        </p>
      </div>

      <GameEndContent targetRun={targetRun} daily={daily} />

      {daily && (
        <div className="w-full h-48">
          <BarChart
            width={350}
            height={180}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              interval={0}
              tickFormatter={(value) => value}
            />
            <YAxis
              label={{ value: 'Attempts', angle: -90 }}
              allowDecimals={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={
                document.documentElement.classList.contains('dark') && {
                  backgroundColor: 'black',
                }
              }
              formatter={(value) =>
                value === 0 ? 'No attempt' : `${value} attempts`
              }
            />
            <Bar
              dataKey="attempts"
              fill="#3B82F6"
              name="Attempts"
              minPointSize={2}
            />
          </BarChart>
        </div>
      )}

      <div className="mb-4 text-center space-y-4">
        {daily && (
          <ModalButton
            onClick={handleShare}
            icon={copied ? Clipboard : Send}
            className={copied ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {copied ? 'Copied to Clipboard!' : 'Share'}
          </ModalButton>
        )}

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

export default WinModal