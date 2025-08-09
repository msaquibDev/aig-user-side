'use client'

import { useState } from 'react'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

// Dummy data
const dummyEvents = [
  {
    id: '1',
    title: 'AIG IBD Summit 2025',
    dateRange: '25 Apr 2025 – 27 Apr 2025',
    location: 'HICC Novotel, Hyderabad, India',
    eventType: 'CME',
    image: '/eventImg/event1.png',
    status: 'upcoming',
    registered: true,
    daysLeft: 2,
  },
  {
    id: '2',
    title: 'Gut, Liver & Lifelines',
    dateRange: '1 Jun 2025',
    location: 'Auditorium, AIG Hospitals',
    eventType: 'Workshop',
    image: '/eventImg/event2.jpg',
    status: 'live',
    registered: true,
  },
  {
    id: '3',
    title: 'Tiny Guts Symposium',
    dateRange: '1 June 2025',
    location: 'Auditorium, AIG Hospitals',
    eventType: 'Conference',
    image: '/eventImg/event3.png',
    status: 'upcoming',
    registered: false,
    daysLeft: 5,
  },
  {
    id: '4',
    title: 'Liver Science 2024',
    dateRange: '15 Mar 2024',
    location: 'AIG Hospitals',
    eventType: 'CME',
    image: '/eventImg/event4.jpg',
    status: 'past',
    registered: false,
  },
]

const TABS = ['Registered', 'All', 'Past']
const FILTERS = ['All', 'CME', 'Workshop', 'Conference']

export default function EventTabs() {
  const [activeTab, setActiveTab] = useState('Registered')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  const router = useRouter()

  const filteredEvents = dummyEvents
    .filter((event) => {
      if (activeTab === 'Registered') return event.registered
      if (activeTab === 'Past') return event.status === 'past'
      return true
    })
    .filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((event) =>
      filterType === 'All' ? true : event.eventType === filterType
    )

  return (
    <section className="px-4 md:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">Events</h1>

      {/* Tabs */}
      <div className="flex gap-6 text-sm font-medium text-blue-900 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'pb-2 transition-all cursor-pointer',
              activeTab === tab
                ? 'border-b-2 border-blue-800 text-blue-900'
                : 'text-gray-500 hover:text-blue-800'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filter (shadcn style) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 cursor-pointer">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            style={{ maxWidth: '350px' }}
            className="flex flex-col rounded-xl overflow-hidden shadow-md border w-full mx-auto h-full"
          >
            {/* Image */}
            <div className="aspect-[3/4] w-full">
              <Image
                src={event.image}
                alt={event.title}
                width={400}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow px-4  pb-3">
              <div className="flex-grow space-y-1.5">
                <h4 className="text-lg font-bold text-black line-clamp-2 leading-tight">
                  {event.title}
                </h4>
                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <CalendarDays className="w-4 h-4" />
                  <span className="truncate">{event.dateRange}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Ticket className="w-4 h-4" />
                  <span className="truncate">{event.eventType}</span>
                </div>

                <div className="mt-4">
                  {event.status === 'live' ? (
                    <div className="w-full bg-green-100 text-green-800 text-xs font-semibold text-center px-3 py-1.5 rounded-md">
                      ✅ Event is Live
                    </div>
                  ) : event.status === 'past' ? (
                    <div className="w-full bg-gray-100 text-gray-700 text-xs font-semibold text-center px-3 py-1.5 rounded-md">
                      🕓 Completed
                    </div>
                  ) : event.registered ? (
                    <div className="w-full bg-blue-100 text-blue-800 text-xs font-semibold text-center px-3 py-1.5 rounded-md">
                      ⏳ Starts in {event.daysLeft} Days
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-[#00509E] hover:bg-[#003B73] text-white text-xs font-semibold py-2 rounded-md"
                      onClick={() =>
                        router.push('/registration/my-registration')
                      }
                    >
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
