import { XIcon, Clipboard, Send, Dices, Undo2 } from 'lucide-react'
import { BarChart, Bar, YAxis, Tooltip, XAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { getDateInMST } from '../Utils/gameLogic'

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
      setTimeout(() => setCopied(false), 4000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

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

        <h2 className="text-xl font-bold mb-4 text-center text-pano">
          Congratulations!
        </h2>

        <div className="mb-4 text-center">
          <p className="text-lg">
            The run was: <span className="font-bold">{targetRun.Name}</span>
          </p>
        </div>

        <div className="mb-4 text-center">
          <p className="text-lg">
            You found the {!daily && 'random'} run in{' '}
            <span className="font-bold">{attempts}</span> attempts!
          </p>
        </div>

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

        {!daily && (
          <div className="mb-6 text-center">
            <p className="text-sm italic">
              This was a random run, it will not be saved to your history
            </p>
          </div>
        )}

        <div className="mb-4 text-center space-y-4">
          {daily && (
            <button
              onClick={handleShare}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                copied
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-panolighter dark:bg-panodarker hover:bg-pano dark:hover:bg-pano'
              } text-white mr-2`}
            >
              <div className="flex text-center gap-2">
                {copied ? (
                  <Clipboard size={20} className="mt-0.5" />
                ) : (
                  <Send size={20} className="mt-0.5" />
                )}
                {copied ? 'Copied to Clipboard!' : 'Share'}
              </div>
            </button>
          )}

          {!daily && (
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 bg-panolighter dark:bg-panodarker hover:bg-pano dark:hover:bg-pano text-white mr-2`}
            >
              <div className="flex text-center gap-2">
                <Undo2 size={20} className="mt-0.5" />
                Back to Daily
              </div>
            </button>
          )}

          <button
            onClick={() => {
              onClose()
              doRandomRun()
            }}
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

export default WinModal
