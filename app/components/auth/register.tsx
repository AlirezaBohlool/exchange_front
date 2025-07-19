import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { post } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیست.");
      showSnackbar("رمز عبور و تکرار آن یکسان نیست.", "error");
      return;
    }
    setLoading(true);
    try {
      await post("/auth/register", {
        user_name: name,
        user_email: email,
        user_password: password,
      });
      showSnackbar("ثبت‌نام با موفقیت انجام شد!", "success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "خطا در ثبت‌نام. لطفا دوباره تلاش کنید.";
      setError(msg);
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-main font-morabba text-center mb-6">ثبت‌نام</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
              نام کامل
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="مثلا علیرضا بهلول"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
              تکرار رمز عبور
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="********"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-main text-white font-semibold cursor-pointer bg-[var(--main-color)] py-2 px-4 rounded-lg hover:bg-main-dark transition"
            disabled={loading}
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          حساب کاربری دارید؟{' '}
          <a href="/login" className="text-main hover:underline color-[var(--main-color)]">
            ورود
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;