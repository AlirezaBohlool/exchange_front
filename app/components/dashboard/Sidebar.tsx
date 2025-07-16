// import React, { useState } from "react";
// import { Link, useLocation } from "react-router";
// import {
//   Home,
//   ShoppingCart,
//   Wallet,
//   CreditCard,
//   Calendar,
//   ClipboardList,
//   Receipt,
//   Star,
//   MessageSquare,
//   User,
//   Users,
//   Phone,
//   LogOut,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react"; // optional, you can use any icon library

// export default function Sidebar() {
//   const location = useLocation();
//   const [openAccounting, setOpenAccounting] = useState(false);
//   const [openHistory, setOpenHistory] = useState(false);

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <div className="w-60 min-h-screen bg-[#000000] text-white p-4 font-morabba text-sm">
//       <div className="space-y-2 rtl:space-y-reverse">

//         <SidebarItem icon={<Home size={18} />} label="پیشخوان" to="/dashboard" active={isActive("/dashboard")} />

//         <SidebarItem icon={<ShoppingCart size={18} />} label="خرید ارز" to="/dashboard/buy" active={isActive("/dashboard/buy")} />
//         <SidebarItem icon={<ShoppingCart size={18} />} label="فروش ارز" to="/dashboard/sell" to="/dashboard/sell" active={isActive("/dashboard/sell")} />

//         {/* حسابداری */}
//         <SidebarParent
//           label="حسابداری"
//           icon={<CreditCard size={18} />}
//           isOpen={openAccounting}
//           toggle={() => setOpenAccounting(!openAccounting)}
//         >
//           <SidebarSubItem label="درخواست های برداشت" to="/dashboard/withdraw-requests" />
//           <SidebarSubItem label="کیف پول" to="/dashboard/wallet" />
//           <SidebarSubItem label="حساب های بانکی" to="/dashboard/banks" />
//         </SidebarParent>

//         {/* تاریخچه */}
//         <SidebarParent
//           label="تاریخچه"
//           icon={<Calendar size={18} />}
//           isOpen={openHistory}
//           toggle={() => setOpenHistory(!openHistory)}
//         >
//           <SidebarSubItem label="سفارش‌ها" to="/dashboard/orders" />
//           <SidebarSubItem label="تراکنش‌ها" to="/dashboard/transactions" />
//         </SidebarParent>

//         <SidebarItem icon={<Star size={18} />} label="سطح کاربری" to="/dashboard/level" active={isActive("/dashboard/level")} />
//         <SidebarItem icon={<MessageSquare size={18} />} label="پشتیبانی" to="/dashboard/support" active={isActive("/dashboard/support")} />
//         <SidebarItem icon={<User size={18} />} label="پروفایل" to="/dashboard/profile" active={isActive("/dashboard/profile")} />
//         <SidebarItem icon={<Users size={18} />} label="معرفی به دوستان" to="/dashboard/referral" active={isActive("/dashboard/referral")} />
//         <SidebarItem icon={<Phone size={18} />} label="تماس با ما" to="/dashboard/contact" active={isActive("/dashboard/contact")} />
//         <SidebarItem icon={<LogOut size={18} />} label="خروج" to="/logout" active={false} />
//       </div>
//     </div>
//   );
// }

// function SidebarItem({
//   icon,
//   label,
//   to,
//   active,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   to: string;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       to={to}
//       className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition text-right ${
//         active ? "bg-[var(--main-color)] text-white" : "hover:bg-gray-800 text-gray-300"
//       }`}
//     >
//       <div className="flex items-center gap-2 rtl:justify-end">
//         {icon}
//         <span>{label}</span>
//       </div>
//     </Link>
//   );
// }

// function SidebarParent({
//   label,
//   icon,
//   isOpen,
//   toggle,
//   children,
// }: {
//   label: string;
//   icon: React.ReactNode;
//   isOpen: boolean;
//   toggle: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <button
//         onClick={toggle}
//         className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-300"
//       >
//         <div className="flex items-center gap-2 rtl:justify-end">
//           {icon}
//           <span>{label}</span>
//         </div>
//         {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//       </button>
//       {isOpen && <div className="pl-6 pr-4 mt-1 space-y-1">{children}</div>}
//     </div>
//   );
// }

// function SidebarSubItem({
//   label,
//   to,
// }: {
//   label: string;
//   to: string;
// }) {
//   const location = useLocation();
//   const active = location.pathname === to;
//   return (
//     <Link
//       to={to}
//       className={`block py-1 px-3 rounded-md text-sm text-right ${
//         active ? "bg-[var(--main-color)] text-white" : "text-gray-400 hover:bg-gray-700"
//       }`}
//     >
//       {label}
//     </Link>
//   );
// }
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
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [openAccounting, setOpenAccounting] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-60 min-h-screen bg-white text-gray-800 p-4 font-morabba text-sm border-l border-gray-200">
      <div className="space-y-2 rtl:space-y-reverse">
        <SidebarItem icon={<Home size={18} />} label="پیشخوان" to="/dashboard" active={isActive("/dashboard")} />
        <SidebarItem icon={<ShoppingCart size={18} />} label="خرید ارز" to="/dashboard/buy" active={isActive("/dashboard/buy")} />
        <SidebarItem icon={<ShoppingCart size={18} />} label="فروش ارز" to="/dashboard/sell" active={isActive("/dashboard/sell")} />

        {/* حسابداری */}
        <SidebarParent
          label="حسابداری"
          icon={<CreditCard size={18} />}
          isOpen={openAccounting}
          toggle={() => setOpenAccounting(!openAccounting)}
        >
          <SidebarSubItem label="درخواست های برداشت" to="/dashboard/withdraw-requests" />
          <SidebarSubItem label="کیف پول" to="/dashboard/wallet" />
          <SidebarSubItem label="حساب های بانکی" to="/dashboard/banks" />
        </SidebarParent>

        {/* تاریخچه */}
        <SidebarParent
          label="تاریخچه"
          icon={<Calendar size={18} />}
          isOpen={openHistory}
          toggle={() => setOpenHistory(!openHistory)}
        >
          <SidebarSubItem label="سفارش‌ها" to="/dashboard/orders" />
          <SidebarSubItem label="تراکنش‌ها" to="/dashboard/transactions" />
        </SidebarParent>

        <SidebarItem icon={<Star size={18} />} label="سطح کاربری" to="/dashboard/level" active={isActive("/dashboard/level")} />
        <SidebarItem icon={<MessageSquare size={18} />} label="پشتیبانی" to="/dashboard/support" active={isActive("/dashboard/support")} />
        <SidebarItem icon={<User size={18} />} label="پروفایل" to="/dashboard/profile" active={isActive("/dashboard/profile")} />
        <SidebarItem icon={<Users size={18} />} label="معرفی به دوستان" to="/dashboard/referral" active={isActive("/dashboard/referral")} />
        <SidebarItem icon={<Phone size={18} />} label="تماس با ما" to="/dashboard/contact" active={isActive("/dashboard/contact")} />
        <SidebarItem icon={<LogOut size={18} />} label="خروج" to="/logout" active={false} />
      </div>
    </div>
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
      className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition text-right ${
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
        className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-[var(--main-color)/10] text-gray-800"
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
      className={`block py-1 px-3 rounded-md text-sm text-right ${
        active
          ? "bg-[var(--main-color)] text-white"
          : "text-gray-700 hover:bg-[var(--main-color)/10]"
      }`}
    >
      {label}
    </Link>
  );
}
