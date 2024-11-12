import { XIcon } from 'lucide-react'
import { BarChart, Bar, YAxis, Tooltip, XAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const StatsModal = ({ isOpen, onClose, attempts }) => {
  const [chartData, setChartData] = useState([])
  const [cookies] = useCookies(['panodle_attempts'])

  const getLast7DaysData = () => {
    const data = []
    const today = new Date()
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
  }, [isOpen, cookies.panodle_attempts, attempts])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Congratulations!</h2>

        <div className="mb-4 text-center">
          <p className="text-lg">
            You found the run in <span className="font-bold">{attempts}</span>{' '}
            attempts!
          </p>
        </div>

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
      </div>
    </div>
  )
}

export default StatsModal
