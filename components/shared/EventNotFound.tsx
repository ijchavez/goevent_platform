import { Button } from '@/components/ui/button'
import Link from 'next/link'

const EventNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">Event Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">
        The event you are looking for may have been removed or is no longer
        available.
      </p>
      <Button size="lg" asChild className="button w-full sm:w-fit">
        <Link href="/">Back to Home Page</Link>
      </Button>
    </div>
  )
}

export default EventNotFound
