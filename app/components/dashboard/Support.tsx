import React, { useState, useEffect } from 'react';
import { post, get } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

interface Ticket {
  ticket_id: number;
  user_id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

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

  // Fetch tickets
  const fetchTickets = async () => {
    if (!userId) return;
    setTicketsLoading(true);
    try {
      const res = await get(`/dashboard/ticket/${userId}`);
      setTickets(res.data.tickets || []);
    } catch {
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line
  }, [userId]);

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
      fetchTickets();
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || 'خطا در ارسال تیکت', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 font-morabba text-gray-800" style={{ fontFamily: 'var(--font-morabba)' }}>
      {/* Ticket Form Section */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-8 border border-gray-100">
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

      {/* Ticket List Section */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-3 text-[var(--main-color)] text-center">تیکت‌های من</h3>
        {ticketsLoading ? (
          <div className="text-center py-4">در حال بارگذاری...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-4 text-gray-500">تیکتی ثبت نشده است.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <table className="w-full text-xs sm:text-base bg-white">
                <thead className="bg-[var(--main-color)] text-white text-sm">
                  <tr>
                    <th className="py-2 px-2 text-center">#</th>
                    <th className="py-2 px-2 text-center">موضوع</th>
                    <th className="py-2 px-2 text-center">پیام</th>
                    <th className="py-2 px-2 text-center">وضعیت</th>
                    <th className="py-2 px-2 text-center">تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, idx) => (
                    <tr key={ticket.ticket_id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                      <td className="py-2 px-2 text-center">{idx + 1}</td>
                      <td className="py-2 px-2 text-center">{ticket.subject}</td>
                      <td className="py-2 px-2 text-center max-w-[180px] truncate" title={ticket.message}>{ticket.message}</td>
                      <td className="py-2 px-2 text-center">
                        {ticket.status === 'open' ? <span className="text-green-600 font-bold">باز</span> : <span className="text-red-500 font-bold">بسته</span>}
                      </td>
                      <td className="py-2 px-2 text-center">{new Date(ticket.created_at).toLocaleDateString('fa-IR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card List */}
            <div className="sm:hidden space-y-4">
              {tickets.map((ticket, idx) => (
                <div key={ticket.ticket_id} className="rounded-xl border border-gray-200 shadow-sm p-3 bg-white flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>#{idx + 1}</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString('fa-IR')}</span>
                  </div>
                  <div className="flex justify-between"><span className="font-bold">موضوع:</span><span>{ticket.subject}</span></div>
                  <div className="flex justify-between"><span className="font-bold">پیام:</span><span className="truncate max-w-[120px]" title={ticket.message}>{ticket.message}</span></div>
                  <div className="flex justify-between"><span className="font-bold">وضعیت:</span><span>{ticket.status === 'open' ? <span className="text-green-600 font-bold">باز</span> : <span className="text-red-500 font-bold">بسته</span>}</span></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}   