import Link from 'next/link';
import React from 'react'
import { FaRegClock } from 'react-icons/fa';
import { GiBlackBook } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";

export default function CourseCard({ course }) {
    const instructorImg = course?.instructorImage || course?.instructor?.picture || course?.instructor?.image || course?.authorImg || course?.authorImage;
    const instructorName = course?.instructor?.name || course?.author || "Unknown Instructor";

    return (
        <section className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full flex flex-col border border-gray-100 h-full">
            {/* Image + Category Badge */}
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-[var(--color-secondary)] text-white text-xs font-semibold px-3 py-1 rounded-md z-10 shadow-sm">
                    {course.category}
                </span>
            </div>

            {/* Body */}
            <div className="p-5 text-left text-[var(--color-text)] flex-1 flex flex-col justify-between">
                <div>
                    {/* Lessons + Duration */}
                    <div className="flex justify-between text-sm mb-2 text-[var(--color-text)]">
                        <div className='flex gap-2 items-center'> 
                            <GiBlackBook className="text-[var(--color-primary)]" />
                            <span>{course.lessons || course.lessonCount || 0} Lessons</span>
                        </div>
                    </div>

                    {/* Title */}
                    <Link href={`/courses/${course.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                        <h3 className="font-semibold mb-3 line-clamp-2 min-h-[3rem] text-base leading-snug">{course.title}</h3>
                    </Link>

                    {/* Pricing */}
                    <div className="mb-3">
                        {course.price === 0 || course.price === null || course.price === undefined ? (
                            <span className="text-[var(--color-accent)] font-bold text-lg">
                                Free
                            </span>
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <span className="text-[var(--color-primary)] font-bold text-lg">
                                    ৳{course?.price || "0.00"}
                                </span>
                                {course.oldPrice && (
                                    <span className="line-through text-gray-400 text-sm">
                                        ৳{course.oldPrice}
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
                    <Link 
                        href={`/courses/${course.slug}`}
                        className="w-full block text-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                    >
                        Explore Course
                    </Link>
                </div>
            </div>
        </section>
    );
}