"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LoaderPinwheel } from "lucide-react"

export default function SignIn() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/studychan/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Sign in failed")
      }

      localStorage.setItem("token", data.token)
      
      if (data.token) {
        window.sessionStorage.setItem("authToken", `Bearer ${data.token}`)
      }

      const createChatResponse = await fetch("http://localhost:3000/api/studychan/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${data.token}`,
          "Content-Type": "application/json",
        }
      })

      const chatData = await createChatResponse.json();

      if (!createChatResponse.ok) {
        throw new Error(chatData.message || "Failed to create chat")
      }

      router.push(`/chat/${chatData.chatId}`)
    } catch (err) {
      setError(err as string)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col space-y-4 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
       <h1 className="font-bold text-5xl text-center">FormAI</h1>
       <p className="text-muted-foreground text-lg mb-6 max-w-xl text-center">Transform PDFs into structured, actionable data using AI-powered text extraction and classification</p>
      
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-8 h-7 w-7 p-0 opacity-50 hover:opacity-100"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && (
                <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            Don&apos;t have an account?{" "}
            <Link 
              href="/signup" 
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}