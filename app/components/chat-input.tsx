"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
import { Send } from 'lucide-react'
import { SkeletonLoader } from "./chat-input-skeleton"
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [signinInfo, setSigninInfo] = useState<{ access_token: string } | null>(null)
  const [playlists, setPlaylists] = useState<{ id: string, name: string }[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("")

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (inputValue.length > 4) {
      setIsLoading(true)
      setSuggestions([])

      timer = setTimeout(() => {
        fetch('/api/ai/input-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: inputValue }),
        })
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.response.suggestions)
            console.log(suggestions)
            setIsLoading(false)
          })
          .catch((error) => {
            console.error('Error:', error)
            setSuggestions([])
            setIsLoading(false)
          })
      }, 500) // Wait for 500ms after the user stops typing
    } else {
      setSuggestions([])
      setIsLoading(false)
    }

    return () => clearTimeout(timer)
  }, [inputValue])

  // try to load user preferences from local storage
  useEffect(() => {
    try {
      const signinInfo = localStorage.getItem("spotify_user")
      if (signinInfo) {
        setSigninInfo(JSON.parse(signinInfo))
        const parsedSigninInfo = JSON.parse(signinInfo)
        fetch(`/api/fetch-preferences/spotify?token=${parsedSigninInfo.access_token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json()).then((data) => {
          if (!data.response) {
            router.push('/connect')
          }
          setPlaylists(data.response)
        })
      }
      const temp_chat = sessionStorage.getItem("temp_chat")
      if (temp_chat) {
        setInputValue(temp_chat)
        sessionStorage.removeItem("temp_chat")
      }
    } catch(e) {
      console.warn(e)
    }

  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(inputValue + " #" + suggestion)
  }

  const handleSend = () => {
    // fetch all the songs in the playlist
    if (selectedPlaylist) {
      let playlistText = ''
      fetch(`/api/fetch-preferences/spotify/${selectedPlaylist}?token=${signinInfo?.access_token}`, {
        method: 'GET',
      }).then(
        (res) => res.json()
      ).then((data) => {
        for (const track of data.response) {
          console.log(track)
          playlistText += track.track.name + "-" + track.track.artists[0].name + "\n"
        }
        sessionStorage.setItem("temp_chat", `keywords: ${inputValue}\nreference: ${playlistText}\npreference: some\nlength: at least 20`)
        router.push("/result")
      })
    } else {
      sessionStorage.setItem("temp_chat", `keywords: ${inputValue}\npreference: some\nlength: at least 20`)
      router.push("/result")
    }
    
    
  }
  const router = useRouter()

  return (
    <div className="w-full mx-auto space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type your words here..."
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow"
        />


        {(signinInfo == null || !signinInfo) ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>We need to learn more from you</AlertDialogTitle>
                <AlertDialogDescription>
                  By providing your playlist to us, the AI can learn more about your preferences and provide better suggestions by the input.
                  We can sync your playlist from Spotify or files.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogCancel onClick={() => {
                  // navigate to the connect page
                  sessionStorage.setItem("temp_chat", inputValue)
                  handleSend()
                }}>Generate Directly</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  // navigate to the connect page
                  sessionStorage.setItem("temp_chat", inputValue)
                  router.push("/connect")
                }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (<AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Choose a playlist</AlertDialogTitle>
              <AlertDialogDescription>
                By providing your playlist to us, the AI can learn more about your preferences and provide better suggestions by the input.
                If you don&apos;t want to provide a playlist, you can generate directly by clicking <i>Continue</i>.
        
              </AlertDialogDescription>
              <Select onValueChange={(value) => setSelectedPlaylist(value)}>
                <SelectTrigger className="w-full mx-auto">
                  <SelectValue placeholder="Select a playlist" />
                </SelectTrigger>
                <SelectContent>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSend}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>)}
      </div>
      <div className="h-[72px]"> {/* Fixed height container */}
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

