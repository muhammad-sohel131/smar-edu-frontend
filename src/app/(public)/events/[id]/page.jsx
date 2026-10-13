'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaAward,
  FaShareAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaTicketAlt,
  FaStar,
  FaUserTie,
  FaCheck,
  FaGlobe,
  FaCopy,
} from 'react-icons/fa';
import { usePublicEvent } from '@/hooks/useEvent';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: eventData, isLoading, error } = usePublicEvent(id);
  const [copied, setCopied] = useState(false);

  const event = eventData?.data;

  const isRegistered = Boolean(
    user?._id && event?.attendees?.some((att) => (att?._id || att) === user._id)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Date to be announced';
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? 'Date TBA' : format(d, 'EEEE, MMMM dd, yyyy');
    } catch {
      return 'Date TBA';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time TBA';
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? 'Time TBA' : format(d, 'hh:mm a');
    } catch {
      return 'Time TBA';
    }
  };

  const formatDuration = (dur) => {
    if (!dur) return '2 Hours';
    if (dur >= 60) {
      const h = Math.floor(dur / 60);
      const m = dur % 60;
      return m > 0 ? `${h}h ${m}m` : `${h} Hours`;
    }
    return `${dur} ${dur === 1 ? 'Hour' : 'Hours'}`;
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Event link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto animate-pulse space-y-8">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-80 bg-gray-200 rounded-3xl" />
              <div className="h-40 bg-gray-200 rounded-2xl" />
            </div>
            <div className="h-96 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm">
            The event you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  const isFree = event.price === 0 || event.price === null || event.price === undefined;
  const isOnline =
    event.location?.toLowerCase().includes('online') ||
    event.location?.toLowerCase().includes('zoom') ||
    event.location?.toLowerCase().includes('meet') ||
    !event.location;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[var(--color-primary)] transition-colors group"
          >
            <FaArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-[var(--color-primary)]" />
            <span>Back to Events</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] bg-gray-50 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg border border-gray-200 transition-colors"
          >
            {copied ? (
              <>
                <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <FaShareAlt className="w-3.5 h-3.5" />
                <span>Share Event</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8">
        {/* Event Header Information */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isFree
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {isFree ? 'Free Event' : `Ticket ৳${event.price}`}
            </span>

            {event.pointsReward > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <FaAward className="w-3.5 h-3.5 text-purple-600" />
                +{event.pointsReward} Points Reward
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
              <FaGlobe className="w-3 h-3 text-gray-500" />
              {isOnline ? 'Online / Virtual' : 'In-Person Event'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            {event.title}
          </h1>

          {/* Quick Meta Stats Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[var(--color-primary)] flex items-center justify-center">
                <FaCalendarAlt className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-800">{formatDate(event.eventDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[var(--color-secondary)] flex items-center justify-center">
                <FaClock className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-800">
                {formatTime(event.eventDate)} ({formatDuration(event.duration)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaMapMarkerAlt className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-800">{event.location || 'Online'}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FaUsers className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-800">
                {event.attendees?.length || 0} Registered Attendees
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details & Overview */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event Banner Image */}
            <div className="relative w-full aspect-video sm:h-[420px] rounded-3xl overflow-hidden bg-gray-100 shadow-md border border-gray-100">
              <img
                src={
                  event.thumbnail ||
                  'https://placehold.co/1200x600/059669/ffffff?text=SmartEdu+Event'
                }
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://placehold.co/1200x600/059669/ffffff?text=SmartEdu+Event';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex justify-between items-end text-white">
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-200 font-semibold mb-1">
                    Event Venue
                  </p>
                  <p className="text-lg font-bold drop-shadow-md">
                    {event.location || 'Online / Remote'}
                  </p>
                </div>

                {event.pointsReward > 0 && (
                  <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <FaStar className="w-3.5 h-3.5 text-amber-300" />
                    <span>+{event.pointsReward} Pts</span>
                  </div>
                )}
              </div>
            </div>

            {/* About This Event Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <span className="w-2.5 h-7 bg-[var(--color-primary)] rounded-full" />
                About This Event
              </h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {event.description || (
                  <p>
                    Join this exclusive SMARTEDU HUB event designed to foster innovation,
                    collaborative learning, and industry connections. Gain practical knowledge,
                    participate in interactive sessions, and earn gamification points to elevate
                    your profile!
                  </p>
                )}
              </div>
            </div>

            {/* Key Benefits / What You Will Experience */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                <span className="w-2.5 h-7 bg-[var(--color-secondary)] rounded-full" />
                What You Will Get
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaAward className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      Gamification Leaderboard Points
                    </h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Earn {event.pointsReward || 50}+ ranking points credited to your profile upon
                      attendance.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaUsers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      Networking & Community
                    </h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Connect with fellow learners, industry leaders, and educators passionate about
                      tech.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">Interactive Q&A</h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Engage directly with the speakers and ask questions in real-time.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaTicketAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      Resources & Access
                    </h3>
                    <p className="text-xs text-gray-600 leading-normal">
                      Get access to shared presentation decks, notes, and session materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Host / Organizer Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
                <span className="w-2.5 h-7 bg-amber-500 rounded-full" />
                Hosted By
              </h2>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-[#0f9293] text-white flex items-center justify-center font-black text-2xl shadow-sm flex-shrink-0">
                  {event.organizer?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {event.organizer?.name || 'SmartEdu Hub Organizers'}
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified Host
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.organizer?.email || 'events@smarteduhub.com'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Committed to empowering students and tech leaders worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Registration / Booking Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-6">
              {/* Price Banner */}
              <div className="pb-6 border-b border-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                  Registration Ticket
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-black ${
                      isFree ? 'text-emerald-600' : 'text-[var(--color-primary)]'
                    }`}
                  >
                    {isFree ? 'FREE' : `৳${event.price}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isFree ? 'No hidden fees' : 'Includes all session access'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isRegistered ? (
                  <div className="w-full py-4 px-4 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-sm">
                    <FaCheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>You Are Registered</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to register for this event');
                        router.push(`/login?redirect=/events/${id}/register`);
                        return;
                      }
                      router.push(`/events/${id}/register`);
                    }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#059669] to-[#0f9293] hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-center block shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-base cursor-pointer"
                  >
                    {isFree ? 'Register for Free' : 'Register & Book Ticket'}
                  </button>
                )}

                <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Instant confirmation & dashboard tracking</span>
                </p>
              </div>

              {/* Summary Items */}
              <div className="space-y-4 pt-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                    Date
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatDate(event.eventDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-gray-400" />
                    Time
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatTime(event.eventDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-gray-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatDuration(event.duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    Location
                  </span>
                  <span className="font-semibold text-gray-800 truncate max-w-[150px]">
                    {event.location || 'Online'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaUsers className="w-4 h-4 text-gray-400" />
                    Attendees
                  </span>
                  <span className="font-semibold text-gray-800">
                    {event.attendees?.length || 0} registered
                  </span>
                </div>

                {event.pointsReward > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FaAward className="w-4 h-4 text-purple-500" />
                      Points
                    </span>
                    <span className="font-bold text-purple-700">
                      +{event.pointsReward} Points
                    </span>
                  </div>
                )}
              </div>

              {/* Share Card Footer */}
              <div className="pt-2">
                <button
                  onClick={handleShare}
                  className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border border-gray-200 transition-colors"
                >
                  <FaCopy className="w-3.5 h-3.5 text-gray-500" />
                  <span>{copied ? 'Link Copied!' : 'Copy Shareable Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
