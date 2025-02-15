"use client"

import { useState } from "react"
import { Loader2, Hash, FileText, Lightbulb } from "lucide-react"

const GeminiGenerator = () => {
  const [inputText, setInputText] = useState("")
  const [hashtags, setHashtags] = useState(null)
  const [captions, setCaptions] = useState(null)
  const [postIdeas, setPostIdeas] = useState(null)
  const [loadingType, setLoadingType] = useState(null)
  const [error, setError] = useState(null)
  const API_KEY = "AIzaSyAQ8Jt_0beMZifR0SiJ-tWM0gXh1bXCY9g" // Replace with your Gemini API key

  const generateContent = async (type) => {
    if (!inputText.trim()) return
    setLoadingType(type)
    setError(null)
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate ${type} for: ${inputText}`,
                  },
                ],
              },
            ],
          }),
        },
      )

      const data = await response.json()
      const generatedText =
        data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join(" ") || "No result found."

      if (type === "hashtags") setHashtags(generatedText)
      else if (type === "captions") setCaptions(generatedText)
      else if (type === "post ideas") setPostIdeas(generatedText)
    } catch (error) {
      setError("Error generating content. Please try again.")
    }
    setLoadingType(null)
  }

  const Button = ({ onClick, loading, children, icon: Icon, color }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 ${color} text-white rounded-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto`}
      disabled={loading}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Icon className="w-5 h-5 mr-2" />}
      {loading ? "Generating..." : children}
    </button>
  )

  const ResultCard = ({ title, content, icon: Icon }) => (
    <div className="p-4 bg-white shadow-md rounded-md mb-4">
      <h2 className="text-lg font-semibold flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        {title}
      </h2>
      <p className="mt-2 text-gray-700">{content}</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AI Social Media Generator</h1>
        <input
          type="text"
          placeholder="Enter topic..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            onClick={() => generateContent("hashtags")}
            loading={loadingType === "hashtags"}
            icon={Hash}
            color="bg-blue-500"
          >
            Generate Hashtags
          </Button>
          <Button
            onClick={() => generateContent("captions")}
            loading={loadingType === "captions"}
            icon={FileText}
            color="bg-purple-500"
          >
            Generate Captions
          </Button>
          <Button
            onClick={() => generateContent("post ideas")}
            loading={loadingType === "post ideas"}
            icon={Lightbulb}
            color="bg-green-500"
          >
            Generate Post Ideas
          </Button>
        </div>
        {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>}
        <div className="space-y-4 mt-6">
          {hashtags && <ResultCard title="Generated Hashtags" content={hashtags} icon={Hash} />}
          {captions && <ResultCard title="Generated Captions" content={captions} icon={FileText} />}
          {postIdeas && <ResultCard title="Generated Post Ideas" content={postIdeas} icon={Lightbulb} />}
        </div>
      </div>
    </div>
  )
}

export default GeminiGenerator

