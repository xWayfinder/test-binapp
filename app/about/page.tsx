import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">About BinsOut</CardTitle>
          <CardDescription>Your local bin collection schedule assistant</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert">
          <p>
            BinsOut is your friendly neighborhood assistant for keeping track of bin collection schedules.
            We help you stay organized and never miss a collection day, whether it&apos;s for general waste,
            recycling, or green waste.
          </p>
          
          <h3 className="text-2xl font-bold text-primary animate-">How It Works</h3>
          <p>
            Simply enter your address, and we&apos;ll show you your upcoming bin collection schedule.
            We&apos;ll tell you which bins to put out and when, making waste management hassle-free.
          </p>

          <h3>Features</h3>
          <ul>
            <li>Easy address lookup</li>
            <li>Detailed collection schedule</li>
            <li>Multiple bin type support</li>
            <li>User-friendly interface</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 