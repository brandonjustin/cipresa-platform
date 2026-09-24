'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ExternalLink, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { events } from '@/lib/utils/data';
import { formatCurrency } from '@/lib/utils/format';

const eventTypeColors: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  workshop: 'warning',
  webinar: 'info',
  conference: 'error',
  training: 'success',
};

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="pt-20">
        <div className="bg-gradient-to-b from-cipresa-950 to-gray-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="success" className="mb-4">Événements</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Événements & Webinaires</h1>
            <p className="text-white/60 max-w-2xl mx-auto">Participez à nos événements et formations en présentiel ou en ligne</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <StaggerItem key={event.id}>
                <Card className="h-full flex flex-col">
                  <div className="relative h-48 bg-gradient-to-br from-cipresa-100 to-cipresa-50 dark:from-cipresa-950 dark:to-gray-900 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-cipresa-300 dark:text-cipresa-700" />
                    <Badge variant={eventTypeColors[event.type]} size="sm" className="absolute top-3 left-3">
                      {event.type === 'workshop' ? 'Atelier' : event.type === 'webinar' ? 'Webinaire' : event.type === 'conference' ? 'Conférence' : 'Formation'}
                    </Badge>
                    {event.price === 0 && <Badge variant="success" size="sm" className="absolute top-3 right-3">Gratuit</Badge>}
                  </div>
                  <CardContent className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {event.date}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {event.time}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cipresa-600">{event.price === 0 ? 'Gratuit' : formatCurrency(event.price ?? 0)}</span>
                      <Button size="sm" icon={ExternalLink} iconPosition="right">S'inscrire</Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  );
}
