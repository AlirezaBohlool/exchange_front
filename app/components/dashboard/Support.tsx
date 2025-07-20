import React, { useState } from 'react';
import { post } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

export default function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Get user_id from localStorage
  let userId = '';
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj.user_id;
      }
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !subject || !message) {
      showSnackbar('لطفاً همه فیلدها را پر کنید.', 'error');
      return;
    }
    setLoading(true);
    try {
      await post('/dashboard/ticket', {
        user_id: userId,
        subject,
        message,
      });
      showSnackbar('تیکت با موفقیت ارسال شد.', 'success');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || 'خطا در ارسال تیکت', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 bg-white rounded-2xl shadow p-4 sm:p-6 font-morabba text-gray-800" style={{ fontFamily: 'var(--font-morabba)' }}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-[var(--main-color)]">ارسال تیکت پشتیبانی</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">موضوع</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
            placeholder="مثلاً مشکل ورود به حساب"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
          
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">پیام</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba min-h-[120px] resize-y"
            placeholder="لطفاً مشکل خود را شرح دهید..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer py-3 rounded-lg font-bold text-lg transition bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)]"
          disabled={loading}
        >
          {loading ? 'در حال ارسال...' : 'ارسال تیکت'}
        </button>
      </form>
    </div>
  );
}   