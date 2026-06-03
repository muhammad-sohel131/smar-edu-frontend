"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Building, MapPin, CalendarDays, Users, FileText, Save } from "lucide-react";

export default function EditProfileModal({ profile, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(() => ({
    ...profile,
    dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
  }));

  useEffect(() => {
    setFormData({
      ...profile,
      dob: profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",
    });
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-5">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                  <p className="text-white/70 text-sm mt-0.5">Update your personal information</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Personal Info Section */}
              <FieldSection title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    icon={<User className="w-4 h-4" />}
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                  <FormField
                    label="Last Name"
                    icon={<User className="w-4 h-4" />}
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  <FormField
                    label="Gender"
                    icon={<Users className="w-4 h-4" />}
                    isSelect
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </FormField>
                  <FormField
                    label="Date of Birth"
                    icon={<CalendarDays className="w-4 h-4" />}
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                  />
                </div>
              </FieldSection>

              {/* Contact Info Section */}
              <FieldSection title="Contact Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Phone Number"
                    icon={<Phone className="w-4 h-4" />}
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                  <FormField
                    label="Region"
                    icon={<MapPin className="w-4 h-4" />}
                    name="region"
                    value={formData.region || ""}
                    onChange={handleChange}
                    placeholder="Region / City"
                  />
                  <FormField
                    label="Organization / School"
                    icon={<Building className="w-4 h-4" />}
                    name="organization"
                    value={formData.organization || ""}
                    onChange={handleChange}
                    placeholder="School or Organization"
                    className="sm:col-span-2"
                  />
                </div>
              </FieldSection>

              {/* Bio Section */}
              <FieldSection title="About Me">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    placeholder="Share something about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[var(--color-text)] bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all resize-none"
                  />
                </div>
              </FieldSection>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-[var(--color-background)]">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:shadow-md hover:shadow-[var(--color-primary)]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ——— Sub-components ——— */

function FieldSection({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-[var(--color-text)]/50 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="h-3 w-0.5 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormField({ label, icon, name, value, onChange, placeholder, type = "text", isSelect = false, children, className = "" }) {
  const baseInputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[var(--color-text)] bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all";

  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <span className="text-[var(--color-primary)]">{icon}</span>
        {label}
      </label>
      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputClass}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputClass}
        />
      )}
    </div>
  );
}
