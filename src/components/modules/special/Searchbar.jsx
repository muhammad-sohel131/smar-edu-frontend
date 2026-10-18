"use client";
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
    MdKeyboardArrowDown,
    MdCheck,
    MdSearch,
    MdClose,
    MdSchool,
    MdArrowForward,
    MdPerson
} from "react-icons/md";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";

/** ---------- Portal (avoids clipping) ---------- */
function MenuPortal({ anchorRef, open, containerRef, children, minWidth, className }) {
    const [box, setBox] = useState(null);

    const updateBox = () => {
        const el = anchorRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setBox({ left: r.left, top: r.bottom + 6, width: r.width });
    };

    useLayoutEffect(() => {
        if (!open) return;
        updateBox();
        window.addEventListener("scroll", updateBox, true);
        window.addEventListener("resize", updateBox);
        return () => {
            window.removeEventListener("scroll", updateBox, true);
            window.removeEventListener("resize", updateBox);
        };
    }, [open]);

    if (!open || !box) return null;

    const computedWidth = typeof window !== 'undefined'
        ? Math.min(window.innerWidth - 32, minWidth ? Math.max(box.width, minWidth) : box.width)
        : box.width;

    const clampedLeft = typeof window !== 'undefined'
        ? Math.max(16, Math.min(box.left, window.innerWidth - computedWidth - 16))
        : box.left;

    return createPortal(
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                left: clampedLeft,
                top: box.top,
                width: computedWidth,
                zIndex: 9999,
            }}
            className={className || "bg-white rounded-xl border border-gray-100 overflow-hidden shadow-2xl max-h-96 overflow-y-auto"}
        >
            {children}
        </div>,
        document.body
    );
}

/** ---------- Custom Select for Categories ---------- */
function CustomSelect({ 
    value, 
    onChange, 
    placeholder = "Select Category",
    categories = [],
    loading = false,
    onOpenChange,
    onSelectOption
}) {
    const [open, setOpen] = useState(false);
    const [hi, setHi] = useState(-1);
    const rootRef = useRef(null);
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    // Convert categories array to options format
    const options = useMemo(() => {
        return categories.map(cat => {
            if (typeof cat === 'object') {
                const label = cat.title || cat.name || cat.label || 'Unnamed Category';
                return {
                    label,
                    value: cat.title || cat.name || cat.slug || label
                };
            }
            return {
                label: cat,
                value: cat
            };
        });
    }, [categories]);

    const selectedOption = options.find((o) =>
        o.value === value ||
        (typeof value === 'string' && o.label?.toLowerCase() === value?.toLowerCase())
    );
    const selectedLabel = value ? (selectedOption?.label || value) : placeholder;

    // click-outside (ignore clicks inside menu portal)
    useEffect(() => {
        function onDoc(e) {
            const t = e.target;
            if (rootRef.current?.contains(t)) return;
            if (menuRef.current?.contains(t)) return;
            setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const openMenu = () => {
        if (loading) return;
        setOpen(true);
        onOpenChange?.(true);
        const idx = Math.max(0, options.findIndex((o) => o.value === value));
        setHi(idx);
    };

    const handleSelect = (val) => {
        onChange?.(val);
        setOpen(false);
        onOpenChange?.(false);
        onSelectOption?.(val);
        btnRef.current?.focus();
    };

    const onKey = (e) => {
        if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openMenu();
            return;
        }
        if (!open) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((p) => (p + 1) % options.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((p) => (p - 1 + options.length) % options.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            const opt = options[hi] ?? options[0];
            handleSelect(opt?.value ?? "");
        } else if (e.key === "Escape") {
            setOpen(false);
            onOpenChange?.(false);
            btnRef.current?.focus();
        }
    };

    return (
        <div ref={rootRef} className="relative w-full">
            <button
                ref={btnRef}
                type="button"
                onClick={openMenu}
                onKeyDown={onKey}
                disabled={loading}
                className="w-full h-12 md:h-[48px] inline-flex items-center justify-between px-4 bg-white text-[var(--color-text)] text-left focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-busy={loading}
            >
                <span className={`truncate mr-2 ${value ? "font-medium text-gray-800" : "text-[var(--color-text)]/60"}`}>
                    {loading ? "Loading categories..." : selectedLabel}
                </span>
                <MdKeyboardArrowDown
                    size={20}
                    className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""} ${loading ? "opacity-50" : ""}`}
                />
            </button>

            {/* Menu in portal */}
            <MenuPortal anchorRef={btnRef} open={open && !loading} containerRef={menuRef} minWidth={240}>
                {options.length === 0 ? (
                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        {loading ? "Loading categories..." : "No categories available"}
                    </div>
                ) : (
                    <ul role="listbox" tabIndex={-1} onKeyDown={onKey} className="py-1">
                        {/* "All Categories" option */}
                        <li
                            role="option"
                            aria-selected={!value}
                            onMouseEnter={() => setHi(-1)}
                            onClick={() => handleSelect("")}
                            className={`
                                px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm text-[var(--color-text)] transition-colors
                                ${hi === -1 ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium" : "hover:bg-gray-50"}
                                ${!value ? "font-semibold text-[var(--color-primary)]" : ""}
                            `}
                        >
                            <span>All Categories</span>
                            {!value && <MdCheck size={18} className="text-[var(--color-primary)]" />}
                        </li>
                        
                        {options.map((opt, i) => {
                            const active = opt.value === value || opt.label?.toLowerCase() === String(value)?.toLowerCase();
                            const highlighted = i === hi;
                            return (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={active}
                                    onMouseEnter={() => setHi(i)}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`
                                        px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm text-[var(--color-text)] transition-colors
                                        ${highlighted ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium" : "hover:bg-gray-50"}
                                        ${active ? "font-semibold text-[var(--color-primary)]" : ""}
                                    `}
                                >
                                    <span className="truncate mr-2">{opt.label}</span>
                                    {active && <MdCheck size={18} className="text-[var(--color-primary)] shrink-0" />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </MenuPortal>
        </div>
    );
}

/** ---------- SearchBar (exported) ---------- */
export default function SearchBar({
    category = "",
    query = "",
    onCategoryChange,
    onQueryChange,
    onSubmit,
    submitLabel = "Search",
    categories = [],
    loading = false
}) {
    const router = useRouter();

    // Course list dropdown state
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [isCourseListOpen, setIsCourseListOpen] = useState(false);

    // References
    const inputWrapperRef = useRef(null);
    const inputRef = useRef(null);
    const courseListMenuRef = useRef(null);

    // Active category name resolution
    const activeCategoryName = useMemo(() => {
        if (!category) return "";
        const matched = categories.find(
            (c) =>
                c.title === category ||
                c.name === category ||
                c.slug === category ||
                String(c._id) === String(category) ||
                c.value === category
        );
        return matched?.title || matched?.name || category;
    }, [category, categories]);

    // Fetch courses when category or query changes
    useEffect(() => {
        let isCancelled = false;
        setCoursesLoading(true);

        const timer = setTimeout(async () => {
            try {
                const params = {
                    limit: 8,
                };
                if (activeCategoryName) {
                    params.categories = activeCategoryName;
                }
                if (query && query.trim()) {
                    params.q = query.trim();
                }

                const res = await api.get('/courses', { params });
                if (!isCancelled) {
                    const fetched = Array.isArray(res.data?.data)
                        ? res.data.data
                        : (res.data?.items || []);
                    setCourses(fetched);
                    setCoursesLoading(false);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Failed to load courses:", err);
                    setCourses([]);
                    setCoursesLoading(false);
                }
            }
        }, 150);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [activeCategoryName, query]);

    // Close course list dropdown on outside click
    useEffect(() => {
        function onDocClick(e) {
            const t = e.target;
            if (inputWrapperRef.current?.contains(t)) return;
            if (courseListMenuRef.current?.contains(t)) return;
            setIsCourseListOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // Handlers
    const handleSubmit = (e) => {
        e?.preventDefault();
        setIsCourseListOpen(false);
        onSubmit?.(e);
    };

    const handleCategorySelectOption = (catVal) => {
        onCategoryChange?.(catVal);
        setIsCourseListOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 60);
    };

    const handleCourseClick = (course) => {
        setIsCourseListOpen(false);
        const slugOrId = course.slug || course._id;
        router.push(`/courses/${slugOrId}`);
    };

    return (
        <form onSubmit={handleSubmit} aria-label="Course search" className="w-full">
            {/* Unified wrapper */}
            <div
                className="
                    flex flex-col md:flex-row w-full
                    overflow-visible md:overflow-hidden rounded-xl bg-white
                    shadow-[var(--shadow-soft)]
                    ring-1 ring-gray-200 focus-within:ring-[var(--color-primary)]
                    divide-y md:divide-y-0 md:divide-x divide-gray-200
                "
            >
                {/* Category Selector */}
                <div className="md:w-[240px] shrink-0">
                    <CustomSelect 
                        value={category} 
                        onChange={onCategoryChange} 
                        categories={categories}
                        loading={loading}
                        placeholder="All Categories"
                        onOpenChange={(isOpen) => {
                            if (isOpen) setIsCourseListOpen(false);
                        }}
                        onSelectOption={handleCategorySelectOption}
                    />
                </div>

                {/* Query Input with live Course List dropdown */}
                <div ref={inputWrapperRef} className="relative flex-1 flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onFocus={() => setIsCourseListOpen(true)}
                        onClick={() => setIsCourseListOpen(true)}
                        onChange={(e) => {
                            onQueryChange?.(e.target.value);
                            setIsCourseListOpen(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                setIsCourseListOpen(false);
                            }
                        }}
                        placeholder={activeCategoryName ? `Search in ${activeCategoryName}...` : "Search for Courses"}
                        className="w-full h-12 md:h-[48px] py-3 bg-white px-4 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none"
                    />

                    {/* Portal Menu showing courses for this field */}
                    <MenuPortal
                        anchorRef={inputWrapperRef}
                        open={isCourseListOpen}
                        containerRef={courseListMenuRef}
                        minWidth={480}
                        className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50/90 to-white border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                    {activeCategoryName ? `Courses in "${activeCategoryName}"` : "Top Courses"}
                                </span>
                                {!coursesLoading && (
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/50">
                                        {courses.length} {courses.length === 1 ? 'course' : 'courses'}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCourseListOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                title="Close"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>

                        {/* Course List Content */}
                        <div className="overflow-y-auto max-h-[340px] divide-y divide-gray-100">
                            {coursesLoading ? (
                                <div className="py-10 px-4 flex flex-col items-center justify-center gap-3 text-gray-400">
                                    <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-medium">Loading courses...</span>
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="py-10 px-4 text-center">
                                    <MdSchool size={36} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm font-semibold text-gray-700">No courses found</p>
                                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                                        {query
                                            ? `No courses matching "${query}" in this category.`
                                            : `There are currently no published courses in ${activeCategoryName || "this category"}.`}
                                    </p>
                                </div>
                            ) : (
                                courses.map((c) => {
                                    const isFree = !c.price || Number(c.price) === 0;
                                    return (
                                        <div
                                            key={c._id || c.slug}
                                            onClick={() => handleCourseClick(c)}
                                            className="p-3.5 hover:bg-orange-50/40 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                {/* Thumbnail */}
                                                <div className="w-14 h-11 md:w-16 md:h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200/70 relative">
                                                    {c.thumbnail ? (
                                                        <img
                                                            src={c.thumbnail}
                                                            alt={c.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                            <MdSchool size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Title & Metadata */}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-[var(--color-accent)] transition-colors">
                                                        {c.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        {c.category && (
                                                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 truncate max-w-[130px]">
                                                                {c.category}
                                                            </span>
                                                        )}
                                                        {c.instructor?.name && (
                                                            <span className="truncate flex items-center gap-1">
                                                                <MdPerson size={13} className="text-gray-400 shrink-0" />
                                                                {c.instructor.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price Badge & Arrow */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isFree ? (
                                                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-700 tracking-wide">
                                                        FREE
                                                    </span>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-900">
                                                        ৳{Number(c.price).toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all shadow-sm">
                                                    <MdArrowForward size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs shrink-0">
                            <span className="text-gray-500 hidden sm:inline">
                                Click any course to view details
                            </span>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="ml-auto font-semibold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 group"
                            >
                                <span>View all {activeCategoryName ? `"${activeCategoryName}"` : ""} courses</span>
                                <MdArrowForward size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </MenuPortal>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    aria-label="Search"
                    title="Search"
                    className="md:w-[140px] h-12 md:h-[48px] shrink-0 inline-flex items-center justify-center gap-2 text-white transition-all font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] shadow-sm hover:shadow-orange-500/25 active:scale-95"
                >
                    <MdSearch size={20} className="shrink-0" />
                    <span>{submitLabel}</span>
                </button>
            </div>
        </form>
    );
}