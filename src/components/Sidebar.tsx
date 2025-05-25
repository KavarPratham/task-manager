'use client';

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useClerk, useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import {
  FaTasks,
  FaCheckCircle,
  FaStar,
  FaSignOutAlt,
  FaSignInAlt,
  FaCog,
  FaLock,
  FaUserCircle,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "All Tasks", href: "/dashboard", icon: <FaTasks /> },
  { label: "Completed", href: "/completed", icon: <FaCheckCircle /> },
  { label: "Important", href: "/important", icon: <FaStar /> },
  { label: "About Project", href: "/about", icon: <FaInfoCircle /> },
];

const Sidebar = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, openUserProfile } = useClerk();
  const { isSignedIn, user } = useUser();

  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "/default-avatar.png",
  };

  // Handler for links & user profile clicks to close sidebar on mobile
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay - only visible on mobile and when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.div
            key="sidebar"
            className="fixed lg:static top-0 left-0 h-full z-40 bg-white dark:bg-gray-900 border-r dark:border-gray-700 w-64 p-4 shadow-sm flex flex-col justify-between"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close button (mobile only) */}
            <div className="lg:hidden flex justify-end mb-4">
              <button
                type="button"
                title="Close"
                onClick={onClose}
                className="text-gray-600 dark:text-gray-300"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Info */}
            <div>
              <div
                className={`flex items-center justify-between p-2 gap-4 rounded-2xl mb-8 transition-all ${
                  isSignedIn
                    ? "hover:bg-gray-800 hover:border-gray-400 cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (isSignedIn) {
                    openUserProfile();
                    handleLinkClick();
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  {isSignedIn ? (
                    <Image
                      src={imageUrl}
                      alt="User avatar"
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-5xl text-gray-400 dark:text-gray-600" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-base text-gray-900 dark:text-gray-100">
                      {isSignedIn ? firstName : "Guest"}
                    </span>
                    {isSignedIn && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {lastName}
                      </span>
                    )}
                  </div>
                </div>
                {isSignedIn && (
                  <FaCog className="text-gray-500 dark:text-gray-400 text-xl" />
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navLinks.map(({ label, href, icon }) => {
                  const isActive = pathname === href;
                  const publicRoutes = ["/dashboard", "/about"];
                  const isProtected = !publicRoutes.includes(href);
                  const disabled = isProtected && !isSignedIn;

                  const baseClasses = `
                    flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm font-medium
                  `;
                  const activeClasses = `
                    bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400 border-l-4 border-blue-600
                  `;
                  const normalClasses = `
                    text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                  `;
                  const disabledClasses = `
                    text-gray-400 dark:text-gray-600 cursor-not-allowed
                  `;

                  if (disabled) {
                    return (
                      <SignInButton key={href} mode="modal">
                        <div
                          className={`${baseClasses} ${disabledClasses} relative group`}
                        >
                          <span className="text-lg">{icon}</span>
                          {label}
                          <FaLock className="ml-auto text-xs text-gray-400" />
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
                            You need to login to access this page
                          </div>
                        </div>
                      </SignInButton>
                    );
                  }

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`${baseClasses} ${
                        isActive ? activeClasses : normalClasses
                      }`}
                      onClick={handleLinkClick}
                    >
                      <span className="text-lg">{icon}</span>
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Action Button */}
            <div className="mt-8">
              {isSignedIn ? (
                <button
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  onClick={() => {
                    signOut(() => router.push("/dashboard"));
                    handleLinkClick();
                  }}
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              ) : (
                <Link href="/sign-in">
                  <button
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={handleLinkClick}
                  >
                    <FaSignInAlt />
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
