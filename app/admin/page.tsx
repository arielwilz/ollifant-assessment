import { readFile } from "fs/promises"
import path from "path"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  let responses: string[][] = []
  let error: string | null = null

  try {
    const csvPath = path.join(process.cwd(), "data", "parent-assessment-responses.csv")
    const csvContent = await readFile(csvPath, "utf-8")
    const lines = csvContent.trim().split("\n")
    responses = lines.map((line) => {
      const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
      return matches ? matches.map((field) => field.replace(/^"|"$/g, "")) : []
    })
  } catch (err) {
    error = "No responses found or error reading file"
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Parent Assessment Responses</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-slate-600">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100">
                      {responses[0]?.map((header, index) => (
                        <th key={index} className="border border-slate-300 px-1 py-1 text-left font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-slate-50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-slate-300 px-1 py-1">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-sm text-slate-600">Total responses: {responses.length - 1}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
