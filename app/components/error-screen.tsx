"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

interface ErrorScreenProps {
  address: string
  onTryAgain: () => void
}

export default function ErrorScreen({ address, onTryAgain }: ErrorScreenProps) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-800">Address Not Found</CardTitle>
            <CardDescription>We couldn't find bin collection information for this address</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">You searched for:</p>
              <p className="font-medium text-gray-900 break-words">{address}</p>
            </div>

            <div className="text-left bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Please check:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Address is within Melbourne City Council area</li>
                <li>• Street name and number are correct</li>
                <li>• Include suburb and postcode</li>
              </ul>
            </div>

            <Button onClick={onTryAgain} className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Another Address
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Need help?</p>
          <p className="text-xs text-gray-500">Contact Melbourne City Council on 03 9658 9658</p>
        </div>
      </div>
    </div>
  )
}
