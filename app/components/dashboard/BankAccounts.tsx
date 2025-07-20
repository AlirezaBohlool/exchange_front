import React, { useState, useEffect } from 'react';
import { post, get } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

interface Card {
  bank_id: number;
  bank_name: string;
  bank_number: string;
  card_holder: string;
  is_active: number;
  created_at: string;
}

export default function BankAccounts() {
  const [bankName, setBankName] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

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

  // Fetch cards
  const fetchCards = async () => {
    if (!userId) return;
    setCardsLoading(true);
    try {
      const res = await get(`/dashboard/bank/${userId}`);
      setCards(res.data.cards || []);
    } catch {
      setCards([]);
    } finally {
      setCardsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !bankName || !bankNumber || !cardHolder) {
      showSnackbar('لطفاً همه فیلدها را پر کنید.', 'error');
      return;
    }
    setLoading(true);
    try {
      await post('/dashboard/bank', {
        user_id: userId,
        bank_name: bankName,
        bank_number: bankNumber,
        card_holder: cardHolder,
      });
      showSnackbar('کارت با موفقیت ثبت شد.', 'success');
      setBankName('');
      setBankNumber('');
      setCardHolder('');
      fetchCards();
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || 'خطا در ثبت کارت', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-20 max-w-md mx-auto font-morabba text-gray-800" style={{ fontFamily: 'var(--font-morabba)' }}>
      {/* Registration Form Section */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-8 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-[var(--main-color)]">ثبت کارت بانکی جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">نام بانک</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
              placeholder="مثلاً ملت"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">شماره کارت</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
              placeholder="مثلاً 6037********1234"
              value={bankNumber}
              onChange={e => setBankNumber(e.target.value.replace(/[^0-9\-]/g, '').slice(0, 19))}
              maxLength={19}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">نام دارنده کارت</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
              placeholder="مثلاً علی رضایی"
              value={cardHolder}
              onChange={e => setCardHolder(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer py-3 rounded-lg font-bold text-lg transition bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)]"
            disabled={loading}
          >
            {loading ? 'در حال ثبت...' : 'ثبت کارت'}
          </button>
        </form>
      </div>

      {/* Card List Section */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-3 text-[var(--main-color)] text-center">کارت‌های ثبت شده</h3>
        {cardsLoading ? (
          <div className="text-center py-4">در حال بارگذاری...</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-4 text-gray-500">کارت ثبت نشده است.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <table className="w-full text-xs sm:text-base bg-white">
                <thead className="bg-[var(--main-color)] text-white text-sm">
                  <tr>
                    <th className="py-2 px-2 text-center">#</th>
                    <th className="py-2 px-2 text-center">نام بانک</th>
                    <th className="py-2 px-2 text-center">شماره کارت</th>
                    <th className="py-2 px-2 text-center">نام دارنده</th>
                    <th className="py-2 px-2 text-center">وضعیت</th>
                    <th className="py-2 px-2 text-center">تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card, idx) => (
                    <tr key={card.bank_id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                      <td className="py-2 px-2 text-center">{idx + 1}</td>
                      <td className="py-2 px-2 text-center">{card.bank_name}</td>
                      <td className="py-2 px-2 text-center">{card.bank_number}</td>
                      <td className="py-2 px-2 text-center">{card.card_holder}</td>
                      <td className="py-2 px-2 text-center">
                        {card.is_active ? <span className="text-green-600 font-bold">فعال</span> : <span className="text-red-500 font-bold">غیرفعال</span>}
                      </td>
                      <td className="py-2 px-2 text-center">{new Date(card.created_at).toLocaleDateString('fa-IR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card List */}
            <div className="sm:hidden space-y-4">
              {cards.map((card, idx) => (
                <div key={card.bank_id} className="rounded-xl border border-gray-200 shadow-sm p-3 bg-white flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>#{idx + 1}</span>
                    <span>{new Date(card.created_at).toLocaleDateString('fa-IR')}</span>
                  </div>
                  <div className="flex justify-between"><span className="font-bold">نام بانک:</span><span>{card.bank_name}</span></div>
                  <div className="flex justify-between"><span className="font-bold">شماره کارت:</span><span>{card.bank_number}</span></div>
                  <div className="flex justify-between"><span className="font-bold">نام دارنده:</span><span>{card.card_holder}</span></div>
                  <div className="flex justify-between"><span className="font-bold">وضعیت:</span><span>{card.is_active ? <span className="text-green-600 font-bold">فعال</span> : <span className="text-red-500 font-bold">غیرفعال</span>}</span></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
