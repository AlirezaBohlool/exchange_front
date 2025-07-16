import React from 'react';
import { Link } from 'react-router';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-main font-morabba text-center mb-6">ورود</h2>
        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-main text-white font-semibold cursor-pointer bg-[var(--main-color)] py-2 px-4 rounded-lg hover:bg-main-dark transition"
          >
            <Link to='/dashboard'>
           ورود
            </Link>
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
         آیا حساب کاربری داری؟ <Link to='/register' className="text-main hover:underline color-[var(--main-color)]">ثبت نام </Link>
        </p>
      </div>
    </div>
  );
}
