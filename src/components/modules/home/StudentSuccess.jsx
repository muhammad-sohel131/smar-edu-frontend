"use client"

export default function StudentSuccess() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="container px-0 mx-auto relative">
        {/* Image Card */}
        <div className="relative rounded-[var(--radius-card)] shadow-[var(--shadow-medium)]">
          <img
            src="/images/students-group.jpg"
            alt="Happy Students"
            className="w-full h-[500px] md:h-[400px] object-cover rounded-[var(--radius-card)]"
          />

          {/* Stats Box */}
          <div className="absolute left-0 right-0 -bottom-10 mx-auto w-[90%] md:w-[85%] bg-[var(--color-primary)] text-white rounded-[var(--radius-card)] shadow-[var(--shadow-medium)] p-6 md:p-10">
            <div className="grid md:grid-cols-3 gap-8 mb-6 text-left">
              <div>
                <h3 className="font-bold text-lg md:text-xl">
                  Trusted by 15,000+ Students
                </h3>
                <p className="text-sm opacity-90">
                  Since 2000
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl">
                  9.8/10 Course Approval
                </h3>
                <p className="text-sm opacity-90">
                  Achieving a complete course approval score is significant.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl">
                  13k+ Satisfied Learners
                </h3>
                <p className="text-sm opacity-90">
                  Students worldwide share a common thread of happiness.
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-6 text-sm italic bg-white/10 p-3 rounded-lg">
              “All courses are incredibly helpful to achieve your goals.”
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}