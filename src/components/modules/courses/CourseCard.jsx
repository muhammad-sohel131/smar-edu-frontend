import Link from 'next/link';
import React from 'react';
import { GiBlackBook } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";

export default function CourseCard({ course }) {
    const instructorImg = course?.instructorImage || course?.instructor?.picture || course?.instructor?.image || course?.authorImg || course?.authorImage;
    const instructorName = course?.instructor?.name || course?.author || "Unknown Instructor";
    const courseUrl = `/courses/${course?.slug || course?._id}`;

    return (
        <Link 
            href={courseUrl}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full flex flex-col border border-gray-100 hover:border-orange-300/80 h-full block text-left text-[var(--color-text)] cursor-pointer"
        >
            {/* Image + Category Badge */}
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={course?.thumbnail}
                    alt={course?.title || "Course thumbnail"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md z-10 shadow-sm border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    {course?.category}
                </span>
                {course?.discountPercentage > 0 && (
                    <span className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-md z-10 shadow-sm">
                        {course.discountPercentage}% Scholarship
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-5 text-left text-[var(--color-text)] flex-1 flex flex-col justify-between">
                <div>
                    {/* Lessons + Duration */}
                    <div className="flex justify-between text-sm mb-2 text-[var(--color-text)]">
                        <div className='flex gap-2 items-center'> 
                            <GiBlackBook className="text-[var(--color-primary)]" />
                            <span>{course?.lessons || course?.lessonCount || 0} Lessons</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold mb-3 line-clamp-2 min-h-[3rem] text-base leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                        {course?.title}
                    </h3>

                    {/* Pricing */}
                    <div className="mb-3">
                        {course?.price === 0 || course?.price === null || course?.price === undefined ? (
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-orange-100/80 text-orange-700 font-bold uppercase tracking-wider">Free</span>
                                {course?.oldPrice ? (
                                    <span className="line-through text-gray-400 text-xs">
                                        ৳{course.oldPrice}
                                    </span>
                                ) : null}
                                {course?.discountPercentage > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                        100% Scholarship
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-[var(--color-primary)] font-bold text-lg">
                                    ৳{course?.price || "0.00"}
                                </span>
                                {course?.oldPrice && (
                                    <span className="line-through text-gray-400 text-sm">
                                        ৳{course.oldPrice}
                                    </span>
                                )}
                                {course?.discountPercentage > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                        -{course.discountPercentage}% Scholarship
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom: Instructor + Action Button */}
                <div className="pt-3 border-t border-gray-100 mt-2 space-y-3">
                    {/* Instructor */}
                    <div className="flex items-center">
                        {instructorImg ? (
                            <img
                                src={instructorImg}
                                alt={instructorName}
                                className="w-8 h-8 rounded-full object-cover mr-2.5 border border-gray-100 shadow-sm flex-shrink-0"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/ins1.jpg";
                                }}
                            />
                        ) : (
                            <FaUserCircle className="w-8 h-8 text-gray-400 mr-2.5 flex-shrink-0" />
                        )}
                        <span className="text-sm text-[var(--color-text)] font-medium truncate">
                            {instructorName}
                        </span>
                    </div>

                    {/* Button in flow */}
                    <span 
                        className="w-full block text-center bg-[var(--color-primary)] group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-sm group-hover:shadow-orange-500/25"
                    >
                        Explore Course
                    </span>
                </div>
            </div>
        </Link>
    );
}
