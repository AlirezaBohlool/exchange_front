import React from "react";
import {
  ShieldCheck,
  Wallet,
  User,
  Star,
  ShoppingCart,
  ArrowLeftRight,
  User2,
  User2Icon,
} from "lucide-react";
import { Link, Links } from "react-router";

export default function Dashboard() {
  // Get user name from localStorage (parse user object)
  let userName = '';
  let userBalence = '';
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userName = userObj.user_name || '';
        userBalence = userObj.user_balance || '';
      }
    } catch (e) {
      userName = '';
    }
  }
  return (
    <div className="p-4  md:p-6 lg:p-10 bg-white text-gray-800 min-h-screen font-morabba">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="bg-[var(--main-color)] text-white py-2 px-4 rounded-xl font-bold flex items-center gap-2">
          <span className="text-lg"><User/></span>
          <span>{userName || 'کاربر'}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-600 select-none">
          <span>
            کیف پول: <span className="text-gray-900 font-bold">{userBalence} تومان</span>
          </span>
        </div>
      </div>

      {/* Stats and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-40 h-40 border-8 border-red-500 rounded-full flex flex-col items-center justify-center text-gray-800 mb-4">
            <div className="text-xs">خرید امروز (تومان)</div>
            <div className="text-xl font-bold">۰</div>
            <div className="text-xs mt-1">سقف خرید روزانه</div>
            <div className="text-sm">۰</div>
          </div>
          <div className="text-sm mt-2">
            سطح کاربری: <span className="font-bold">صفر ستاره</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 text-lg mt-1">
            {[...Array(10)].map((_, i) => (
              <Star key={i} size={18} className="stroke-1" />
            ))}
          </div>
          <a href="#" className="mt-2 text-[var(--main-color)] text-xs hover:underline">
            افزایش سطح کاربری
          </a>
        </div>

        {/* Right Card */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center">
          <div className="text-sm text-gray-500 mb-4">ارز را انتخاب کنید</div>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {[ "ترون"].map((coin, i) => (
              <Link to='/dashboard/buy' key={i}>
              <button
                key={i}
                className="bg-white cursor-pointer text-gray-800 border border-gray-300 rounded-xl py-2 px-4 min-w-[60px] hover:border-[var(--main-color)]"
              >
                {coin}
              </button>
              </Link>
            ))}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            خرید از ما: <span className="text-gray-900 font-bold">۸۹,۹۰۰ تومان</span>
            <br /> فروش به ما: <span className="text-gray-900 font-bold">۸۸,۰۰۰ تومان</span>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to='/dashboard/buy'>
            <button className="cursor-pointer bg-[var(--main-color)] text-white py-2 px-6 rounded-xl font-semibold hover:bg-[var(--main-color-dark)]">
              خرید تتر
            </button>
            </Link>
            <Link to='/dashboard/sell'>
            <button className="cursor-pointer bg-red-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-red-600">
              فروش تتر
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Order Section */}
      <div className="bg-gray-100 text-center rounded-2xl py-6 px-4">
        <div className="text-sm text-gray-500 mb-2">سفارشات خرید و فروش</div>
        <div className="text-sm text-gray-600">سفارشی ثبت نشده است ❌</div>
      </div>
    </div>
  );
}