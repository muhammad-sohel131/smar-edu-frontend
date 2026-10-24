"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle,
  FiFileText,
  FiHeadphones,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiExternalLink,
  FiEye,
  FiDownload,
  FiX,
  FiCheckCircle,
  FiAward,
  FiLock,
} from "react-icons/fi";
import { useLessonsByUnit } from "@/hooks/useCourse";
import { useTasks } from "@/hooks/useTask";
import { getEmbedVideoUrl, isDirectVideoFile } from "@/helpers/videoUrl";

// Helper to format lesson duration into human readable text
const formatDuration = (sec) => {
  if (!sec || isNaN(sec)) return "5 min";
  if (sec >= 3600) {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  const mins = Math.floor(sec / 60);
  const remainingSecs = sec % 60;
  if (mins > 0 && remainingSecs > 0) return `${mins}m ${remainingSecs}s`;
  if (mins > 0) return `${mins} min`;
  return `${sec}s`;
};

// Content type styling metadata
const getContentTypeConfig = (type) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return {
        icon: FiFileText,
        label: "PDF Guide",
        bg: "bg-rose-50 border-rose-100",
        iconColor: "text-rose-500",
        badgeBg: "bg-rose-100/70 text-rose-700 border-rose-200",
        ring: "group-hover:border-rose-300",
      };
    case "audio":
      return {
        icon: FiHeadphones,
        label: "Audio Lecture",
        bg: "bg-purple-50 border-purple-100",
        iconColor: "text-purple-600",
        badgeBg: "bg-purple-100/70 text-purple-700 border-purple-200",
        ring: "group-hover:border-purple-300",
      };
    case "article":
      return {
        icon: FiBookOpen,
        label: "Article / Notes",
        bg: "bg-amber-50 border-amber-100",
        iconColor: "text-amber-600",
        badgeBg: "bg-amber-100/70 text-amber-700 border-amber-200",
        ring: "group-hover:border-amber-300",
      };
    case "video":
    default:
      return {
        icon: FiPlayCircle,
        label: "Video Lesson",
        bg: "bg-blue-50 border-blue-100",
        iconColor: "text-blue-500",
        badgeBg: "bg-blue-100/70 text-blue-700 border-blue-200",
        ring: "group-hover:border-blue-300",
      };
  }
};

export default function CourseContent({ units = [] }) {
  const [openUnit, setOpenUnit] = useState(0); // Open first unit by default
  const [previewItem, setPreviewItem] = useState(null); // { type, title, url }

  return (
    <>
      <section className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-emerald-100/80 shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 rounded-xl shadow-md shadow-emerald-500/20 text-white">
              <FiPlayCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Course Curriculum & Modules
              </h2>
              <p className="text-sm text-gray-600">
                {units.length} comprehensive modules • Real videos, PDFs, audio guides, hands-on tasks & quizzes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-medium">
              <FiPlayCircle className="w-3.5 h-3.5 text-blue-500" /> Video
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 font-medium">
              <FiFileText className="w-3.5 h-3.5 text-rose-500" /> PDF Guide
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 font-medium">
              <FiHeadphones className="w-3.5 h-3.5 text-purple-500" /> Audio
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-medium">
              <FiBookOpen className="w-3.5 h-3.5 text-amber-500" /> Article
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium">
              <FiAward className="w-3.5 h-3.5 text-emerald-500" /> Practice Tasks
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60 font-medium">
              <FiHelpCircle className="w-3.5 h-3.5 text-violet-500" /> Quizzes
            </span>
          </div>
        </div>

        {!units?.length ? (
          <div className="text-center py-10">
            <div className="inline-block p-4 bg-emerald-50 rounded-full mb-3">
              <FiPlayCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-gray-600 font-medium">Curriculum is being prepared for this course.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {units.map((unit, idx) => (
              <UnitAccordion
                key={unit._id || idx}
                unit={unit}
                index={idx}
                isOpen={openUnit === idx}
                onToggle={() => setOpenUnit(openUnit === idx ? null : idx)}
                setPreviewItem={setPreviewItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==== Universal Media Preview Modal (Video / Audio / PDF / Article) ==== */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {previewItem.type} Preview
                  </span>
                  <h3 className="font-bold text-gray-900 text-base truncate max-w-md">
                    {previewItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Body depending on Content Type */}
              <div className="p-0">
                {previewItem.type === "video" && (
                  <div className="aspect-video bg-black">
                    {isDirectVideoFile(previewItem.url) ? (
                      <video
                        src={previewItem.url}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={getEmbedVideoUrl(previewItem.url)}
                        title={previewItem.title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                )}

                {previewItem.type === "audio" && (
                  <div className="p-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/30 mb-5 animate-pulse">
                      <FiHeadphones className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{previewItem.title}</h4>
                    <p className="text-sm text-purple-200 mb-6 max-w-md">
                      Stream high-clarity conceptual audio lecture anywhere, on any device.
                    </p>
                    <audio
                      src={previewItem.url}
                      controls
                      autoPlay
                      className="w-full max-w-md rounded-xl shadow-md accent-purple-500"
                    />
                  </div>
                )}

                {previewItem.type === "pdf" && (
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-rose-50/40 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-md shadow-rose-200/50">
                      <FiFileText className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {previewItem.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-6 max-w-md">
                      Official curriculum reading material & architecture cheatsheet.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={previewItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <FiExternalLink className="w-4 h-4" /> Open Full PDF Document
                      </a>
                      <a
                        href={previewItem.url}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
                      >
                        <FiDownload className="w-4 h-4" /> Download PDF
                      </a>
                    </div>
                  </div>
                )}

                {previewItem.type === "article" && (
                  <div className="p-6 md:p-8 bg-white max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold mb-2">
                      <FiBookOpen className="w-4 h-4" /> Curated Reading Article
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {previewItem.title}
                    </h3>
                    <div className="prose prose-emerald max-w-none text-gray-700 text-sm leading-relaxed space-y-4">
                      <p>
                        This in-depth deep-dive article provides exhaustive theoretical and hands-on production instructions for this module topic.
                      </p>
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                        <strong>Key Learning Objectives:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                          <li>Deep architectural understanding & edge-case handling</li>
                          <li>Production code snippets and implementation best practices</li>
                          <li>Step-by-step verification commands & debugging tips</li>
                        </ul>
                      </div>
                      <p>
                        Enrolled students get unrestricted access to the complete interactive reader, annotated code samples, and downloadable practice exercises.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span>Free lesson sample provided for prospective learners</span>
                <span>Press ESC or click backdrop to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------ Unit Accordion ------------------------------ */
function UnitAccordion({ unit, index, isOpen, onToggle, setPreviewItem }) {
  const { data: lessons = [], isLoading } = useLessonsByUnit(unit._id);
  const { data: tasks = [] } = useTasks(unit._id);

  const practicalTasks = tasks.filter((t) => t.type !== "quiz");
  const quizTasks = tasks.filter((t) => t.type === "quiz");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-emerald-200 bg-white shadow-md shadow-emerald-500/5 ring-1 ring-emerald-100"
          : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-sm"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full text-left p-4.5 sm:p-5 rounded-2xl transition-colors hover:bg-emerald-50/20"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
              isOpen
                ? "bg-gradient-to-r from-[var(--color-primary)] to-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {index + 1}
          </div>
          <div className="text-left flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {unit.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-gray-600">
              <span className="font-medium text-gray-700">
                {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
              </span>
              {practicalTasks.length > 0 && (
                <span className="text-emerald-700 font-medium">
                  • {practicalTasks.length} {practicalTasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
              {quizTasks.length > 0 && (
                <span className="text-purple-700 font-medium">
                  • {quizTasks.length} {quizTasks.length === 1 ? "quiz" : "quizzes"}
                </span>
              )}
              {unit.duration && <span>• {unit.duration}</span>}
            </div>
          </div>
        </div>

        <div
          className={`p-2 rounded-xl transition-colors ml-3 ${
            isOpen
              ? "bg-emerald-100 text-[var(--color-primary)]"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isOpen ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 sm:p-5 space-y-2.5">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8">
                  <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-600">Loading module lessons...</span>
                </div>
              ) : lessons.length ? (
                <>
                  {lessons.map((lesson, lessonIdx) => {
                    const typeConfig = getContentTypeConfig(lesson.contentType);
                    const IconComponent = typeConfig.icon;
                    const canPreview = index === 0 && lessonIdx === 0;

                    return (
                      <motion.div
                        key={lesson._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: lessonIdx * 0.03 }}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all group shadow-sm ${
                          canPreview
                            ? "bg-gradient-to-r from-gray-50/70 to-white hover:from-white hover:to-emerald-50/30 border-gray-100 hover:border-emerald-200/80 hover:shadow"
                            : "bg-gray-50/40 border-gray-100/90 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`p-2.5 rounded-xl border ${typeConfig.bg} ${typeConfig.iconColor} transition-transform group-hover:scale-105 flex-shrink-0 ${
                              !canPreview ? "opacity-80" : ""
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border ${typeConfig.badgeBg}`}
                              >
                                {typeConfig.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDuration(lesson.durationSec)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {canPreview ? (
                            <button
                              onClick={() =>
                                setPreviewItem({
                                  type: lesson.contentType || "video",
                                  title: lesson.title,
                                  url: lesson.contentUrl,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-500 border border-gray-200/80">
                              <FiLock className="w-3 h-3 text-gray-400" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Render Practical Tasks / Assignments */}
                  {practicalTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mt-2.5 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border border-emerald-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
                          {task.type === "video" ? <FiPlayCircle className="w-4 h-4" /> : <FiFileText className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {task.title}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                              {task.type === "video" ? "Video Demo Task" : "Practical Project"}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="self-end sm:self-center flex-shrink-0 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-500 border border-gray-200/80">
                          <FiLock className="w-3 h-3 text-gray-400" />
                          <span>Locked</span>
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {task.maxPoints || 15} pts
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Render Module Knowledge-Check Quizzes */}
                  {quizTasks.map((qTask) => (
                    <motion.div
                      key={qTask._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mt-2.5 p-3.5 rounded-xl bg-gradient-to-r from-purple-50/70 to-indigo-50/40 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 flex-shrink-0">
                          <FiHelpCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {qTask.title}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                              Module Quiz
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Pass Mark: 70% • Instant Feedback Assessment & Leaderboard Points
                          </p>
                        </div>
                      </div>
                      <div className="self-end sm:self-center flex-shrink-0 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-500 border border-gray-200/80">
                          <FiLock className="w-3 h-3 text-gray-400" />
                          <span>Locked</span>
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {qTask.maxPoints || 10} pts
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <FiPlayCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No lessons available in this module.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}