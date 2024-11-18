import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import Papa from 'papaparse'
import { getDateInMST } from '../Utils/gameLogic'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const loadRunData = async () => {
  try {
    const csvPath = join(__dirname, '..', 'runs.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')

    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          const rows = results.data.map((v) => ({
            ...v,
            Length: parseInt(v['Length']),
            StartingElevation: parseInt(v['Starting Elevation']),
            EndingElevation: parseInt(v['Ending Elevation']),
          }))
          resolve(rows)
        },
        error: (error) => reject(error),
      })
    })
  } catch (e) {
    console.log('Error loading run data')
  }
}

const verifyData = async () => {
  try {
    const runs = await loadRunData()
    const dailyDataPath = join(__dirname, '..', 'daily.json')
    const dailyData = JSON.parse(await fs.readFile(dailyDataPath, 'utf-8'))

    let dailyValue = undefined
    let date = new getDateInMST()
    date.setDate(date.getDate() - 1)

    do {
      date.setDate(date.getDate() + 1)
      let dateStr = date.toISOString().split('T')[0]
      dailyValue = runs.find((run) => dailyData[dateStr] === run.Name)
    } while (dailyValue !== undefined)

    console.log(`Ends on ${date.toISOString().split('T')[0]}`)
  } catch (error) {
    console.error('Verification failed:', error)
    process.exit(1)
  }
}

verifyData()
