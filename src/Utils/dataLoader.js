import RunsData from "../runs.csv"
import Papa from "papaparse";

export const loadRunData = async () => {
  const response = await fetch(RunsData);
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value);
  const results = Papa.parse(csv, { header: true });
  return results.data.map(v => ({
    ...v,
    Length: parseInt(v["Length"]),
    StartingElevation: parseInt(v["Starting Elevation"]),
    EndingElevation: parseInt(v["Ending Elevation"])
  }));
};