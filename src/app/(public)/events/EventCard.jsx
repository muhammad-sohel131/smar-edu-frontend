import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import Link from 'next/link';

export default function EventCard({ event }) {
  const { user } = useAuth();
  const isRegistered = Boolean(
    user?._id && event?.attendees?.some((att) => (att?._id || att) === user._id)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? 'TBA' : format(d, 'MMM dd, yyyy');
    } catch {
      return 'TBA';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? '' : format(d, 'hh:mm a');
    } catch {
      return '';
    }
  };

  return (
    <Link 
      href={`/events/${event._id}`}
      className="group bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full block text-left cursor-pointer border border-gray-100"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={event.thumbnail || 'https://placehold.co/600x400/ececec/cccccc?text=Event+Image'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/600x400/ececec/cccccc?text=Event+Image';
          }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            event.price === 0 
              ? 'bg-emerald-500 text-white'
              : 'bg-[var(--color-accent)] text-[var(--color-text)]'
          }`}>
            {event.price === 0 ? 'FREE' : `৳${event.price}`}
          </span>
        </div>

        {/* Points Badge */}
        {event.pointsReward > 0 && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-secondary)] text-white flex items-center gap-1 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              +{event.pointsReward}
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
            <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.eventDate)}</span>
            <span className="mx-0.5">•</span>
            <span>{formatTime(event.eventDate)}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[var(--color-text)] mb-2 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
            {event.description || 'Join this amazing event to learn and network!'}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location || 'Online'}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-3 border-t border-gray-100 mt-2 space-y-3">
          {/* Organizer */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 text-[var(--color-primary)] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {event.organizer?.name?.charAt(0) || 'E'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--color-text)] truncate">
                {event.organizer?.name || 'Event Organizer'}
              </p>
              <p className="text-[11px] text-gray-400">
                {event.attendees?.length || 0} attendees
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            {isRegistered ? (
              <span className="w-full py-2 px-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs sm:text-sm font-semibold text-center block">
                Registered ✓
              </span>
            ) : (
              <span className="w-full py-2 px-3 text-center rounded-lg text-xs sm:text-sm font-medium transition-colors bg-[var(--color-primary)] group-hover:bg-[var(--color-primary-hover)] text-white block shadow-xs group-hover:shadow">
                View Details & Register
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}