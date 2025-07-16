import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-center md:text-right font-morabba">
        
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-[var(--main-color)]">درباره ما</h3>
          <p className="text-gray-600 leading-6">
            این یک پلتفرم امن برای خرید و فروش ارز دیجیتال است که تجربه کاربری ساده و امنی فراهم می‌کند.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-[var(--main-color)]">لینک‌های مفید</h3>
          <ul className="space-y-2 rtl:space-y-reverse">
            <li><a href="/rules" className="hover:underline text-[var(--main-color)]">قوانین و مقررات</a></li>
            <li><a href="/faq" className="hover:underline text-[var(--main-color)]">سوالات متداول</a></li>
            <li><a href="/blog" className="hover:underline text-[var(--main-color)]">وبلاگ</a></li>
            <li><a href="/contact" className="hover:underline text-[var(--main-color)]">تماس با ما</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-[var(--main-color)]">ما را دنبال کنید</h3>
          <div className="flex justify-center md:justify-end space-x-4 rtl:space-x-reverse">
            <a href="#" className="text-[var(--main-color)] hover:underline">تلگرام</a>
            <a href="#" className="text-[var(--main-color)] hover:underline">اینستاگرام</a>
            <a href="#" className="text-[var(--main-color)] hover:underline">توییتر</a>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 py-4 text-xs border-t border-gray-100 mt-4 font-morabba">
        © {new Date().getFullYear()} تمام حقوق محفوظ است.
      </div>
    </footer>
  );
}
