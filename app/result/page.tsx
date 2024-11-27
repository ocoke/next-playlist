'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress"

export default function Home() {
    const router = useRouter();
    const [title, setTitle] = useState<string>('')
    const [suggestions, setSuggestions] = useState<{ title: string, artist: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [analysis, setAnalysis] = useState<string>('')
    const [suggestionSummary, setSuggestionSummary] = useState<string>('')
    const [progress, setProgress] = useState<number>(0)
    useEffect(() => {
        const temp_chat = sessionStorage.getItem("temp_chat")
        if (!temp_chat) {
            router.push('/')
        }
        setIsLoading(true)
        fetch('/api/ai/playlist-suggestions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: temp_chat }),
          })
            .then((res) => res.json())
            .then((data) => {
              setTitle(data.response.title)
              setSuggestions(data.response.playlist)
              setAnalysis(data.response.analysis)
              setSuggestionSummary(data.response.suggestionSummary)
              console.log(suggestions)
              setIsLoading(false)
              sessionStorage.removeItem("temp_chat")
            })
            .catch((error) => {
              console.error('Error:', error)
              setSuggestions([])
              setIsLoading(false)
            })
      }, [])

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 8));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isLoading]);
    

    return (
      <div className="main">
           <div className="my-12">
            <div className="w-full mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter">{isLoading ? 'Loading...' : title}</h1>
              <div className="mt-6">
                <div className="text-lg font-medium">{analysis}</div>
                <div className="text-lg font-medium mt-4">{suggestionSummary}</div>
                <div className="mt-4">
                  {isLoading && <Progress value={progress} />
                }
                {!isLoading && (
                    <div className="p-4 bg-gray-100 rounded">
                    <ul className="pl-4 list-disc" translate="no">
                      {!isLoading && suggestions.map((suggestion, index) => (
                        <li key={index} className="mb-2">{suggestion.title} by {suggestion.artist}</li>
                      ))}
                      </ul>
                    </div>
                )}
                <p className="mt-4 text-amber-700">The information is generated by AI, and it can make mistake. Check before you use.</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }