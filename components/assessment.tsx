"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, Heart, Users, MessageCircle, Shield, Lightbulb, Target } from "lucide-react"
import { saveParentAssessmentResponse, type ParentAssessmentResponse } from "@/lib/save-responses"

type Answer = "A" | "B" | null
type Answers = Record<number, Answer>

interface Question {
  id: number
  pillar: string
  text: string
  optionA: string
  optionB: string
}

export default function Assessment() {
  const [currentPage, setCurrentPage] = useState<number>(0) // 0 = intro, 1-12 = question pages, 13 = results
  const [answers, setAnswers] = useState<Answers>({})
  const [showResults, setShowResults] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)

  const pillars = [
    { name: "Kesejahteraan Pribadi", icon: <Heart className="h-6 w-6" />, color: "text-red-600" },
    { name: "Kekompakan Pasangan", icon: <Users className="h-6 w-6" />, color: "text-blue-600" },
    { name: "Filosofi Pengasuhan", icon: <Lightbulb className="h-6 w-6" />, color: "text-yellow-600" },
    { name: "Lingkungan Keluarga", icon: <Shield className="h-6 w-6" />, color: "text-green-600" },
    { name: "Keintiman Hubungan", icon: <MessageCircle className="h-6 w-6" />, color: "text-purple-600" },
    { name: "Visi Bersama", icon: <Target className="h-6 w-6" />, color: "text-indigo-600" },
  ]

  // Sample questions - you can replace these with your actual 60 questions
  const questions: Question[] = [
    // Pilar 1: Kesejahteraan Pribadi (Questions 1-10)
    {
      id: 1,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika Anda merasa stres dengan pekerjaan dan tanggung jawab sebagai orang tua, apa yang biasanya Anda lakukan?",
      optionA: "Saya mencoba menyelesaikan semua tugas sendiri dan tidak ingin membebani orang lain",
      optionB: "Saya mencari bantuan dari pasangan atau keluarga untuk berbagi beban",
    },
    {
      id: 2,
      pillar: "Kesejahteraan Pribadi",
      text: "Bagaimana Anda mengelola waktu untuk diri sendiri di tengah kesibukan mengurus keluarga?",
      optionA: "Saya merasa egois jika mengambil waktu untuk diri sendiri",
      optionB: "Saya percaya bahwa merawat diri sendiri penting untuk menjadi orang tua yang baik",
    },
    {
      id: 3,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika Anda menghadapi masalah emosional, bagaimana cara Anda mengatasinya?",
      optionA: "Saya cenderung menyimpan perasaan untuk diri sendiri",
      optionB: "Saya terbuka berbagi perasaan dengan orang terdekat",
    },
    {
      id: 4,
      pillar: "Kesejahteraan Pribadi",
      text: "Bagaimana Anda memandang pentingnya hobi atau minat pribadi?",
      optionA: "Hobi adalah hal yang bisa ditunda demi keluarga",
      optionB: "Hobi membantu saya menjadi pribadi yang lebih seimbang",
    },
    {
      id: 5,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika merasa lelah secara fisik dan mental, apa prioritas utama Anda?",
      optionA: "Tetap menjalankan semua tanggung jawab meski lelah",
      optionB: "Mengambil waktu istirahat yang diperlukan",
    },
    {
      id: 6,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika di restoran dengan menu yang belum pernah kamu coba sebelumnya. Apa yang kamu pilih?",
      optionA: "Aku memilih sesuatu yang baru, tanpa meminta saran",
      optionB: "Aku menyanyakan rekomendasi kepada pelayan atau teman",
    },
    {
      id: 7,
      pillar: "Kesejahteraan Pribadi",
      text: "Saat kamu memasuki ruangan penuh dengan orang yang belum pernah kamu temui, bagaimana kamu biasanya merespons?",
      optionA: "Aku bersikap untuk mendekati orang lain, menyapa mereka dan memulai pembicaraan dengan mudah",
      optionB:
        "Aku cenderung mencari tempat duduk dan menunggu orang lain mendekati, terlalu malu untuk memulai percakapan",
    },
    {
      id: 8,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika berbicara di depan umum, bagaimana sikap tubuhmu?",
      optionA: "Aku berdiri dengan percaya diri saat orang lain memperhatikanku",
      optionB: "Aku sering kali mengerakkan badan",
    },
    {
      id: 9,
      pillar: "Kesejahteraan Pribadi",
      text: "Dalam sebuah diskusi kelompok, bagaimana kamu menunjukkan keterlibatan?",
      optionA: "Aku cenderung diam dan hanya mengiluti arus diskusinya",
      optionB: "Aku mengungkap jika setuju dan sesekali menyampaikan pendapat dengan suara yang jelas",
    },
    {
      id: 10,
      pillar: "Kesejahteraan Pribadi",
      text: "Saat berada di acara sosial, bagaimana kamu biasanya berdiri atau duduk di sekitar orang lain?",
      optionA: "Aku berdiri atau duduk dengan nyaman, aku juga mudah terlibat dalam percakapan dengan orang lain",
      optionB: "Aku seringkali duduk untuk menuhui diri dari orang lain",
    },

    // Pilar 2: Kekompakan Pasangan (Questions 11-20)
    {
      id: 11,
      pillar: "Kekompakan Pasangan",
      text: "Ketika Anda dan pasangan memiliki perbedaan pendapat tentang cara mendidik anak, bagaimana Anda menyelesaikannya?",
      optionA: "Kami berdiskusi secara pribadi dan mencari solusi bersama",
      optionB: "Salah satu dari kami biasanya mengalah untuk menghindari konflik",
    },
    {
      id: 12,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda dan pasangan membagi tanggung jawab dalam mengurus rumah tangga?",
      optionA: "Kami memiliki pembagian tugas yang jelas dan konsisten",
      optionB: "Kami fleksibel dan saling membantu sesuai kebutuhan",
    },
    {
      id: 13,
      pillar: "Kekompakan Pasangan",
      text: "Ketika salah satu dari Anda sedang menghadapi masalah, bagaimana dukungan diberikan?",
      optionA: "Kami memberikan ruang untuk menyelesaikan masalah sendiri",
      optionB: "Kami aktif mendengarkan dan memberikan dukungan emosional",
    },
    {
      id: 14,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda menangani situasi ketika anak mencoba mengadu domba orang tua?",
      optionA: "Kami langsung mengklarifikasi dan menunjukkan kesatuan",
      optionB: "Kami mendengarkan anak terlebih dahulu sebelum merespons",
    },
    {
      id: 15,
      pillar: "Kekompakan Pasangan",
      text: "Dalam hal pengambilan keputusan penting untuk keluarga, bagaimana prosesnya?",
      optionA: "Salah satu dari kami biasanya memimpin dalam pengambilan keputusan",
      optionB: "Kami selalu memutuskan bersama dengan konsensus",
    },
    {
      id: 16,
      pillar: "Kekompakan Pasangan",
      text: "Ketika ada perbedaan gaya komunikasi antara Anda dan pasangan, bagaimana mengatasinya?",
      optionA: "Kami berusaha menyesuaikan gaya komunikasi satu sama lain",
      optionB: "Kami menerima perbedaan dan mencari cara untuk saling memahami",
    },
    {
      id: 17,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda menunjukkan apresiasi terhadap pasangan di depan anak-anak?",
      optionA: "Kami menunjukkan apresiasi melalui tindakan sehari-hari",
      optionB: "Kami secara verbal mengungkapkan rasa terima kasih dan pujian",
    },
    {
      id: 18,
      pillar: "Kekompakan Pasangan",
      text: "Ketika menghadapi tekanan dari keluarga besar, bagaimana Anda dan pasangan merespons?",
      optionA: "Kami memprioritaskan keharmonisan dengan keluarga besar",
      optionB: "Kami memprioritaskan kesepakatan internal keluarga inti",
    },
    {
      id: 19,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda mengelola waktu berdua tanpa anak-anak?",
      optionA: "Kami jarang memiliki waktu khusus berdua",
      optionB: "Kami secara rutin menyediakan waktu untuk hubungan kami",
    },
    {
      id: 20,
      pillar: "Kekompakan Pasangan",
      text: "Dalam situasi krisis atau darurat keluarga, bagaimana Anda bekerja sama?",
      optionA: "Kami secara otomatis tahu peran masing-masing",
      optionB: "Kami berkomunikasi intensif untuk koordinasi",
    },

    // Continue with other pillars... (I'll add placeholder questions for now)
    // Pilar 3: Filosofi Pengasuhan (Questions 21-30)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: 21 + i,
      pillar: "Filosofi Pengasuhan",
      text: `Pertanyaan Filosofi Pengasuhan ${i + 1}`,
      optionA: "Opsi A untuk filosofi pengasuhan",
      optionB: "Opsi B untuk filosofi pengasuhan",
    })),

    // Pilar 4: Lingkungan Keluarga (Questions 31-40)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: 31 + i,
      pillar: "Lingkungan Keluarga",
      text: `Pertanyaan Lingkungan Keluarga ${i + 1}`,
      optionA: "Opsi A untuk lingkungan keluarga",
      optionB: "Opsi B untuk lingkungan keluarga",
    })),

    // Pilar 5: Keintiman Hubungan (Questions 41-50)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: 41 + i,
      pillar: "Keintiman Hubungan",
      text: `Pertanyaan Keintiman Hubungan ${i + 1}`,
      optionA: "Opsi A untuk keintiman hubungan",
      optionB: "Opsi B untuk keintiman hubungan",
    })),

    // Pilar 6: Visi Bersama (Questions 51-60)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: 51 + i,
      pillar: "Visi Bersama",
      text: `Pertanyaan Visi Bersama ${i + 1}`,
      optionA: "Opsi A untuk visi bersama",
      optionB: "Opsi B untuk visi bersama",
    })),
  ]

  const handleAnswerChange = (questionId: number, value: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const getCurrentPageQuestions = () => {
    if (currentPage === 0 || currentPage > 12) return []
    const startIndex = (currentPage - 1) * 5
    return questions.slice(startIndex, startIndex + 5)
  }

  const getCurrentPillarTitle = () => {
    if (currentPage === 0 || currentPage > 12) return ""
    const pageQuestions = getCurrentPageQuestions()
    if (pageQuestions.length > 0) {
      const pillarName = pageQuestions[0].pillar
      return `Pertanyaan ${pillarName}`
    }
    return ""
  }

  const areAllCurrentQuestionsAnswered = () => {
    const pageQuestions = getCurrentPageQuestions()
    return pageQuestions.every((q) => answers[q.id] !== null && answers[q.id] !== undefined)
  }

  const handleNext = async () => {
    if (currentPage === 0) {
      setCurrentPage(1)
    } else if (currentPage < 12) {
      if (areAllCurrentQuestionsAnswered()) {
        setCurrentPage(currentPage + 1)
      }
    } else if (currentPage === 12) {
      if (areAllCurrentQuestionsAnswered()) {
        // Save responses and show results
        const pillarScores = calculatePillarScores()
        const overallResult = calculateOverallResult(pillarScores)

        const responseData: ParentAssessmentResponse = {
          timestamp: new Date().toISOString(),
          answers: answers as Record<number, "A" | "B">,
          pillarScores,
          overallResult,
        }

        try {
          const saveResult = await saveParentAssessmentResponse(responseData)
          setSaveStatus(saveResult)
        } catch (error) {
          setSaveStatus({ success: false, message: "Failed to save response" })
        }

        setShowResults(true)
        setCurrentPage(13)
      }
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const calculatePillarScores = () => {
    const scores: Record<string, { A: number; B: number }> = {}

    pillars.forEach((pillar) => {
      scores[pillar.name] = { A: 0, B: 0 }
    })

    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        scores[question.pillar][answer]++
      }
    })

    return scores
  }

  const calculateOverallResult = (pillarScores: Record<string, { A: number; B: number }>) => {
    let totalA = 0
    let totalB = 0

    Object.values(pillarScores).forEach((scores) => {
      totalA += scores.A
      totalB += scores.B
    })

    if (totalA > totalB) {
      return totalA > totalB * 1.5 ? "Strongly Directive" : "Moderately Directive"
    } else if (totalB > totalA) {
      return totalB > totalA * 1.5 ? "Strongly Collaborative" : "Moderately Collaborative"
    } else {
      return "Balanced Approach"
    }
  }

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Mulai Tes</span>
          <span>Panduan Penggunaan</span>
          <span>Metodologi</span>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
            Profil
          </Button>
        </div>
      </div>
    </div>
  )

  const renderIntro = () => (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800">FOLKATIVE</CardTitle>
                <CardDescription className="text-lg text-gray-600">Tes Kepribadian</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              <p className="text-gray-700 text-lg text-center">
                Selamat datang di assessment kepribadian yang akan membantu Anda memahami gaya pengasuhan dan dinamika
                keluarga Anda.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pillars.map((pillar, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <span className={pillar.color}>{pillar.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{pillar.name}</span>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-3">Cara Mengerjakan:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Assessment ini terdiri dari 60 pertanyaan yang dibagi dalam 12 halaman</li>
                  <li>• Setiap halaman berisi 5 pertanyaan yang harus dijawab semua</li>
                  <li>• Pilih opsi A atau B yang paling sesuai dengan situasi Anda</li>
                  <li>• Anda tidak dapat melanjutkan jika belum menjawab semua pertanyaan di halaman tersebut</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Mulai Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )

  const renderQuestionPage = () => {
    const pageQuestions = getCurrentPageQuestions()
    const pillarTitle = getCurrentPillarTitle()

    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">FOLKATIVE</h1>
                <p className="text-gray-600">{pillarTitle}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / 12) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">Step {currentPage} of 12</p>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-8">
                {pageQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Question {(currentPage - 1) * 5 + index + 1}</h3>
                    <p className="text-gray-700 leading-relaxed">{question.text}</p>

                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value as Answer)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2 bg-orange-100 p-4 rounded-lg border border-orange-200 hover:bg-orange-200 transition-colors flex-1">
                          <RadioGroupItem value="A" id={`question-${question.id}-A`} className="text-orange-600" />
                          <Label htmlFor={`question-${question.id}-A`} className="cursor-pointer flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                                A
                              </div>
                              <div className="text-gray-700">{question.optionA}</div>
                            </div>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2 bg-orange-100 p-4 rounded-lg border border-orange-200 hover:bg-orange-200 transition-colors flex-1">
                          <RadioGroupItem value="B" id={`question-${question.id}-B`} className="text-orange-600" />
                          <Label htmlFor={`question-${question.id}-B`} className="cursor-pointer flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                                B
                              </div>
                              <div className="text-gray-700">{question.optionB}</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-8 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-6 py-2 bg-transparent"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!areAllCurrentQuestionsAnswered()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
              >
                {currentPage === 12 ? "Lihat Hasil" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  const renderResults = () => {
    const pillarScores = calculatePillarScores()
    const overallResult = calculateOverallResult(pillarScores)

    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="text-center py-8 bg-orange-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Hasil Assessment Anda</CardTitle>
              <CardDescription className="text-orange-100 text-lg mt-2">
                Gaya Pengasuhan dan Dinamika Keluarga
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{overallResult}</h3>
                  <p className="text-gray-600">Pendekatan pengasuhan Anda secara keseluruhan</p>
                </div>

                {saveStatus && (
                  <div
                    className={`p-4 rounded-lg border ${
                      saveStatus.success
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    <p className="text-sm">
                      {saveStatus.success ? "✅ Respons berhasil disimpan" : "⚠️ " + saveStatus.message}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">📊 Skor Berdasarkan Pilar</h3>
                  {pillars.map((pillar) => {
                    const scores = pillarScores[pillar.name]
                    const total = scores.A + scores.B
                    const percentageA = total > 0 ? Math.round((scores.A / total) * 100) : 0
                    const percentageB = total > 0 ? Math.round((scores.B / total) * 100) : 0

                    return (
                      <div key={pillar.name} className="bg-gray-50 p-6 rounded-lg border">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={pillar.color}>{pillar.icon}</span>
                          <h4 className="font-semibold text-gray-800 text-lg">{pillar.name}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-700">Pendekatan A</span>
                              <span className="font-semibold text-gray-800">
                                {scores.A} ({percentageA}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentageA}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-700">Pendekatan B</span>
                              <span className="font-semibold text-gray-800">
                                {scores.B} ({percentageB}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentageB}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-8 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(0)
                  setShowResults(false)
                  setSaveStatus(null)
                  setAnswers({})
                }}
                className="px-8 py-3"
              >
                Ulangi Assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    return renderResults()
  }

  if (currentPage === 0) {
    return renderIntro()
  }

  return renderQuestionPage()
}
