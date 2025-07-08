"use server"

import { writeFile, readFile } from "fs/promises"
import path from "path"

export interface ParentAssessmentResponse {
  timestamp: string
  answers: Record<number, "A" | "B">
  pillarScores: Record<string, { A: number; B: number }>
  overallResult: string
}

export async function saveParentAssessmentResponse(data: ParentAssessmentResponse) {
  try {
    const csvPath = path.join(process.cwd(), "data", "parent-assessment-responses.csv")
    const dataDir = path.join(process.cwd(), "data")

    // Ensure data directory exists
    try {
      await readFile(dataDir)
    } catch {
      const { mkdir } = await import("fs/promises")
      await mkdir(dataDir, { recursive: true })
    }

    // Check if CSV file exists
    let csvExists = false
    try {
      await readFile(csvPath)
      csvExists = true
    } catch {
      csvExists = false
    }

    // Create CSV header if file doesn't exist
    let csvContent = ""
    if (!csvExists) {
      const questionHeaders = Array.from({ length: 60 }, (_, i) => `Q${i + 1}`)
      const pillarHeaders = Object.keys(data.pillarScores).flatMap((pillar) => [`${pillar}_A`, `${pillar}_B`])
      csvContent = ["Timestamp", ...questionHeaders, ...pillarHeaders, "Overall_Result"].join(",") + "\n"
    }

    // Create CSV row
    const answers = Array.from({ length: 60 }, (_, i) => `"${data.answers[i + 1] || ""}"`)
    const pillarScores = Object.values(data.pillarScores).flatMap((scores) => [scores.A, scores.B])

    const row = [`"${data.timestamp}"`, ...answers, ...pillarScores, `"${data.overallResult}"`].join(",")

    csvContent += row + "\n"

    // Append to file
    if (csvExists) {
      const existingContent = await readFile(csvPath, "utf-8")
      csvContent = existingContent + row + "\n"
    }

    await writeFile(csvPath, csvContent)

    return { success: true, message: "Response saved successfully" }
  } catch (error) {
    console.error("Error saving parent assessment response:", error)
    return { success: false, message: "Failed to save response" }
  }
}
