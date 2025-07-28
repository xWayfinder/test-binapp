"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Trash2, Recycle, Leaf } from "lucide-react"
import type { BinData } from "@/types"

interface ResultsScreenProps {
  address: string
  binData: BinData
  onNewSearch: () => void
}

const getBinIcon = (type: string) => {
  switch (type) {
    case "general":
      return <Trash2 className="w-5 h-5" />
    case "recycling":
      return <Recycle className="w-5 h-5" />
    case "green":
      return <Leaf className="w-5 h-5" />
    default:
      return <Trash2 className="w-5 h-5" />
  }
}

export default function ResultsScreen({ address, binData, onNewSearch }: ResultsScreenProps) {
  const currentDate = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onNewSearch}
            className="mb-4 text-primary hover:text-primary/90 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Search
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Bin Collection Schedule</h1>
            <div className="flex items-center justify-center text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{address}</span>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {binData.zone}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-muted rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-800">Current Date</CardTitle>
                  <CardDescription>Today's date</CardDescription>
                </div>
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-xl font-semibold text-gray-900">{currentDate}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-accent rounded-t-lg">
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 text-green-600" />
                Next Collection
              </CardTitle>
              <CardDescription>Bins to put out</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 mb-2">{binData.nextCollection.date}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 mb-3">Put out these bins:</h3>
                {binData.nextCollection.bins.map((bin, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 rounded-lg border-2 border-border bg-background hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${bin.color} flex items-center justify-center text-white mr-4`}
                    >
                      {getBinIcon(bin.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{bin.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{bin.type} waste collection</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-accent">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Reminder</h3>
                <p className="text-sm text-blue-800">
                  Put your bins out by 6:00 AM on collection day. Bins should be placed at the kerb with lids closed and
                  handles facing the street.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
