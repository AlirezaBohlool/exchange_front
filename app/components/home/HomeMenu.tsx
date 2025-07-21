import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const menuItems = [
  { label: "خانه", href: "/" },
  { label: "خرید تتر", href: "/buy-tether" },
  { label: "خرید ترون", href: "/buy-tron" },
  { label: "قوانین و مقررات", href: "/rules" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "وبلاگ", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export default function HomeMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for user data in local storage to determine login status
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 mr-4" />
        </div>
        <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-700 font-medium transition hover:text-[var(--main-color)]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="text-white px-4 py-2 rounded transition font-medium mt-2 hover:bg-[var(--main-color-dark)]"
              style={{ backgroundColor: "var(--main-color)" }}
            >
              داشبورد
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-white px-4 py-2 rounded transition font-medium mt-2 hover:bg-[var(--main-color-dark)]"
              style={{ backgroundColor: "var(--main-color)" }}
            >
              ورود به پنل
            </Link>
          )}
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Open menu"
            onClick={() => {
              const menu = document.getElementById("mobile-menu");
              if (menu) menu.classList.toggle("hidden");
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div id="mobile-menu" className="md:hidden hidden px-4 pb-4">
        <div className="flex flex-col space-y-2 rtl:space-y-reverse">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
            className="text-gray-700 font-medium transition hover:text-[var(--main-color)]"
            >
              {item.label}
            </a>
          ))}
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="text-white px-4 py-2 rounded transition font-medium mt-2 hover:bg-[var(--main-color-dark)]"
              style={{ backgroundColor: "var(--main-color)" }}
            >
              داشبورد
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-white px-4 py-2 rounded transition font-medium mt-2 hover:bg-[var(--main-color-dark)]"
              style={{ backgroundColor: "var(--main-color)" }}
            >
              ورود به پنل
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
