import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { post } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email || !password) {
        showSnackbar("وارد کردن ایمیل و رمز عبور الزامی است.", "error");
        setLoading(false);
        return;
      }
      const response = await post("auth/login", {
        user_email: email,
        user_password: password,
      });
      // Save user info in localStorage
      if (response?.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      showSnackbar("ورود با موفقیت انجام شد!", "success");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      // Handle backend error messages
      let msg = "خطا در ورود. لطفا دوباره تلاش کنید.";
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = "خطا: " + err.message;
      }
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-main font-morabba text-center mb-6">ورود</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-main text-white font-semibold cursor-pointer bg-[var(--main-color)] py-2 px-4 rounded-lg hover:bg-main-dark transition"
            disabled={loading}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
         آیا حساب کاربری داری؟ <Link to='/register' className="text-main hover:underline color-[var(--main-color)]">ثبت نام </Link>
        </p>
      </div>
    </div>
  );
}
