"use client"
import Image from "next/image";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-secondary)]">
              <span className="text-2xl font-extrabold tracking-tight text-[var(--color-primary)]">SMARTEDU<span className="text-[var(--color-accent)]">HUB</span></span>
            </h2>
            <p className="text-[var(--color-text)] mb-6 leading-relaxed">
              Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-secondary)]">
              Support
            </h3>
            <ul className="space-y-2 text-[var(--color-text)]">
              <li><Link href="/about" className="hover:text-[var(--color-primary)] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[var(--color-primary)] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-secondary)]">
              Useful Links
            </h3>
            <ul className="space-y-2 text-[var(--color-text)]">
              <li><Link href="/courses" className="hover:text-[var(--color-primary)] transition-colors">Courses</Link></li>
              <li><Link href="/events" className="hover:text-[var(--color-primary)] transition-colors">Events</Link></li>
              <li><Link href="/donation" className="hover:text-[var(--color-primary)] transition-colors">Donation</Link></li>
              <li><Link href="/instructors" className="hover:text-[var(--color-primary)] transition-colors">Instructors</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-secondary)]">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-text)]/80">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--color-primary)] shrink-0">
                  <FaMapMarkerAlt className="text-base" />
                </span>
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--color-primary)] shrink-0">
                  <FaPhoneAlt className="text-sm" />
                </span>
                <a
                  href="tel:+8801700000000"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[var(--color-primary)] shrink-0">
                  <FaEnvelope className="text-sm" />
                </span>
                <a
                  href="mailto:support@smarteduhub.com"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  support@smarteduhub.com
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]/60 mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <FaFacebookF size={13} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <FaTwitter size={13} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <FaLinkedinIn size={13} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <FaYoutube size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--color-primary)] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[var(--color-text)]/70 text-sm">
              Copyright 2023 © All rights reserved.
            </div>
            <div className="flex space-x-6 text-[var(--color-text)]/70 text-sm">
              <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;