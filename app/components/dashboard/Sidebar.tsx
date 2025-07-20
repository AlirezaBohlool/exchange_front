import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  ShoppingCart,
  Wallet,
  CreditCard,
  Calendar,
  Star,
  MessageSquare,
  User,
  Users,
  Phone,
  LogOut,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  ListOrdered,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [openAccounting, setOpenAccounting] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get role from localStorage (default to 'user' if not set)
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') || 'user' : 'user';

  const isActive = (path: string) => location.pathname === path;

  // Responsive sidebar toggle button (hamburger)
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 bg-gray-200  rounded-lg p-2 md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-md z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white text-gray-800 p-4 font-morabba text-sm border-l border-gray-200 transform transition-transform duration-300 md:static md:translate-x-0 md:w-60 md:min-h-screen ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        style={{ maxWidth: '100vw' }}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h1 className="text-2xl font-bold">آلتربیت</h1>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Desktop title */}
        <h1 className="w-full justify-center pt-4 pb-4 text-4xl cursor-pointer select-none hidden md:flex">آلتربیت</h1>
        <div className="space-y-2 rtl:space-y-reverse">
          <SidebarItem icon={<Home size={18} />} label="پیشخوان" to="/dashboard" active={isActive("/dashboard")} />
          <SidebarItem icon={<ShoppingCart size={18} />} label="خرید ارز" to="/dashboard/buy" active={isActive("/dashboard/buy")} />
          <SidebarItem icon={<ShoppingCart size={18} />} label="فروش ارز" to="/dashboard/sell" active={isActive("/dashboard/sell")} />

          {/* حسابداری - Only for admin */}
          {role === 'user' && (
            <SidebarParent
              label="حسابداری"
              icon={<CreditCard size={18} />}
              isOpen={openAccounting}
              toggle={() => setOpenAccounting(!openAccounting)}
            >
              <SidebarSubItem label="درخواست های برداشت" to="/dashboard/withdraw-requests" />
              <SidebarSubItem  label="کیف پول" to="/dashboard/wallet" />
              <SidebarSubItem label="حساب های بانکی" to="/dashboard/banks" />
            </SidebarParent>
          )}

          {/* تاریخچه - For all users */}
          <SidebarParent
            label="تاریخچه"
            icon={<Calendar size={18} />}
            isOpen={openHistory}
            toggle={() => setOpenHistory(!openHistory)}
          >
            <SidebarSubItem label="سفارش‌ها" to="/dashboard/orders" />
            <SidebarSubItem label="تراکنش‌ها" to="/dashboard/transactions" />
          </SidebarParent>

          {/* سطح کاربری - Only for user */}
          {role === 'user' && (
            <SidebarItem icon={<ListOrdered size={18} />} label="سفارش ها " to="/dashboard/level" active={isActive("/dashboard/level")} />
          )}
          {role === 'user' && (
            <SidebarItem icon={<ArrowLeftRight size={18} />} label="تراکنش ها" to="/dashboard/transactions" active={isActive("/dashboard/level")} />
          )}

          <SidebarItem icon={<MessageSquare size={18} />} label="تیکت" to="/dashboard/support" active={isActive("/dashboard/support")} />
          {/* پروفایل - For all users */}
          {/* <SidebarItem icon={<User size={18} />} label="پروفایل" to="/dashboard/profile" active={isActive("/dashboard/profile")} /> */}
          {/* معرفی به دوستان - Only for user */}
          {/* {role === 'user' && (
            <SidebarItem icon={<Users size={18} />} label="معرفی به دوستان" to="/dashboard/referral" active={isActive("/dashboard/referral")} />
          )} */}
          <SidebarItem icon={<Phone size={18} />} label="تماس با ما" to="/dashboard/contact" active={isActive("/dashboard/contact")} />
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="flex select-none cursor-pointer items-center justify-between gap-2 px-4 py-2 rounded-lg transition text-right hover:bg-[var(--main-color)/10] text-gray-800 w-full"
          >
            <div className="flex items-center gap-2 rtl:justify-end">
              <LogOut size={18} />
              <span>خروج</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex select-none cursor-pointer items-center justify-between gap-2 px-4 py-2 rounded-lg transition text-right ${
        active ? "bg-[var(--main-color)] text-white" : "hover:bg-[var(--main-color)/10] text-gray-800"
      }`}
    >
      <div className="flex items-center gap-2 rtl:justify-end">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

function SidebarParent({
  label,
  icon,
  isOpen,
  toggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={toggle}
        className="w-full select-none cursor-pointer flex justify-between items-center px-4 py-2 rounded-lg hover:bg-[var(--main-color)/10] text-gray-800"
      >
        <div className="flex items-center gap-2 rtl:justify-end">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="pl-6 pr-4 mt-1 space-y-1">{children}</div>}
    </div>
  );
}

function SidebarSubItem({
  label,
  to,
}: {
  label: string;
  to: string;
}) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`block select-none py-1 px-3 rounded-md text-sm text-right cursor-pointer ${
        active
          ? "bg-[var(--main-color)] text-white"
          : "text-gray-700 hover:bg-[var(--main-color)/10]"
      }`}
    >
      {label}
    </Link>
  );
}
