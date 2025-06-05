import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Palette, Type, Monitor, Check } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "@/components/Button/mode-toggle"
import { useNavigate } from "react-router-dom"

const themeOptions = [
  {
    id: "blue",
    name: "Ocean Blue",
    description: "Cool and professional",
    primary: "bg-blue-500",
    secondary: "bg-blue-100",
    accent: "bg-blue-600"
  },
  {
    id: "green",
    name: "Forest Green",
    description: "Natural and calming",
    primary: "bg-green-500",
    secondary: "bg-green-100",
    accent: "bg-green-600"
  },
  {
    id: "purple",
    name: "Royal Purple",
    description: "Creative and modern",
    primary: "bg-purple-500",
    secondary: "bg-purple-100",
    accent: "bg-purple-600"
  },
  {
    id: "orange",
    name: "Sunset Orange",
    description: "Warm and energetic",
    primary: "bg-orange-500",
    secondary: "bg-orange-100",
    accent: "bg-orange-600"
  },
  {
    id: "pink",
    name: "Rose Pink",
    description: "Soft and elegant",
    primary: "bg-pink-500",
    secondary: "bg-pink-100",
    accent: "bg-pink-600"
  },
  {
    id: "teal",
    name: "Ocean Teal",
    description: "Fresh and vibrant",
    primary: "bg-teal-500",
    secondary: "bg-teal-100",
    accent: "bg-teal-600"
  }
]

const fontOptions = [
  {
    id: "inter",
    name: "Inter",
    description: "Modern and readable",
    className: "font-sans",
    preview: "The quick brown fox jumps over the lazy dog"
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Clean and friendly",
    className: "font-sans",
    preview: "The quick brown fox jumps over the lazy dog"
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Geometric and modern",
    className: "font-sans",
    preview: "The quick brown fox jumps over the lazy dog"
  },
  {
    id: "source-serif",
    name: "Source Serif Pro",
    description: "Traditional and elegant",
    className: "font-serif",
    preview: "The quick brown fox jumps over the lazy dog"
  },
  {
    id: "playfair",
    name: "Playfair Display",
    description: "Stylish and distinctive",
    className: "font-serif",
    preview: "The quick brown fox jumps over the lazy dog"
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    description: "Perfect for code",
    className: "font-mono",
    preview: "The quick brown fox jumps over the lazy dog"
  }
]

export default function Settings() {
  const [selectedTheme, setSelectedTheme] = useState("blue")
  const [selectedFont, setSelectedFont] = useState("inter")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const navigate = useNavigate()

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)
    setHasUnsavedChanges(true)
  }

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId)
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving settings:", {
      theme: selectedTheme,
      font: selectedFont
    })
    setHasUnsavedChanges(false)
  }

  const handleReset = () => {
    setSelectedTheme("blue")
    setSelectedFont("inter")
    setHasUnsavedChanges(false)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
      if (!confirmLeave) return
    }
    // Navigate back to dashboard
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-muted border-current border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Settings</h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Customize your experience
                  </span>
                  {hasUnsavedChanges && (
                    <Badge variant="secondary" className="text-xs">
                      Unsaved changes
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize how the interface looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <ModeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Theme Colors</CardTitle>
              </div>
              <CardDescription>
                Choose your preferred color scheme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themeOptions.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTheme === theme.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex gap-1">
                        <div
                          className={`w-4 h-4 rounded-full ${theme.primary}`}
                        />
                        <div
                          className={`w-4 h-4 rounded-full ${theme.secondary}`}
                        />
                        <div
                          className={`w-4 h-4 rounded-full ${theme.accent}`}
                        />
                      </div>
                    </div>
                    <h3 className={`font-medium `}>{theme.name}</h3>
                    <p className={`text-sm text-muted-foreground`}>
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Font Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                <CardTitle>Typography</CardTitle>
              </div>
              <CardDescription>
                Select your preferred font family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fontOptions.map((font) => (
                  <div
                    key={font.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFont === font.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleFontChange(font.id)}
                  >
                    {selectedFont === font.id && (
                      <div className="absolute top-4 right-4">
                        <Check className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-muted-foreground">
                          {font.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {font.className.replace("font-", "")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {font.description}
                      </p>
                      <p className={`text-lg ${font.className} text-primary`}>
                        {font.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:hidden">
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="w-full"
          >
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset to Defaults
          </Button>
        </div>
      </main>
    </div>
  )
}
