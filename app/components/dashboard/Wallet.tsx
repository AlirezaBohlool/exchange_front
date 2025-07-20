import React, { useEffect, useState } from 'react';
import { get, post } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

interface UserInfo {
  user_id: number;
  user_balance: number;
  [key: string]: any;
}

export default function Wallet() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const { showSnackbar } = useSnackbar();

  // Get user_id from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.user_id) {
          fetchUserInfo(userObj.user_id);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (user_id: number) => {
    setLoading(true);
    try {
      const res = await get(`/dashboard/user/${user_id}`);
      setUser(res.data.user); // Use the nested user object
    } catch {
      showSnackbar('خطا در دریافت اطلاعات کاربر', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      showSnackbar('مبلغ معتبر وارد کنید', 'error');
      return;
    }
    try {
      const route = action === 'deposit' ? '/dashboard/deposit' : '/dashboard/withdraw';
      const res = await post(route, { user_id: user.user_id, amount: amt });
      showSnackbar('عملیات با موفقیت انجام شد', 'success');
      fetchUserInfo(user.user_id); // Refresh balance
      setAmount('');
    } catch (err: any) {
      showSnackbar(
        err?.response?.data?.message || 'خطا در انجام عملیات',
        'error'
      );
    }
  };

  // Helper to format with commas
  const formatWithCommas = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num) return '';
    return Number(num).toLocaleString();
  };

  // Handle input change with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    // Only allow numbers
    if (!/^\d*$/.test(raw)) return;
    setAmount(raw);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white mt-20 rounded-2xl shadow p-6 mt-6 font-morabba text-gray-800"
      style={{ fontFamily: 'var(--font-morabba)' }}>
      <h2 className="text-2xl font-bold mb-4 text-center text-[var(--main-color)]">کیف پول من</h2>
      {loading ? (
        <div className="text-center py-8">در حال بارگذاری...</div>
      ) : user ? (
        <>
          <div className="mb-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-1">موجودی فعلی:</div>
            <div className="text-3xl font-bold text-[var(--main-color)] mb-2">{Number(user.user_balance).toLocaleString()} <span className="text-base font-normal">تومان</span></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg font-bold border transition text-sm cursor-pointer ${action === 'deposit' ? 'bg-[var(--main-color)] text-white border-[var(--main-color)]' : 'bg-white text-gray-800 border-gray-300 hover:border-[var(--main-color)]'}`}
                onClick={() => setAction('deposit')}
              >
                واریز
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg font-bold border transition text-sm cursor-pointer ${action === 'withdraw' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-800 border-gray-300 hover:border-red-500'}`}
                onClick={() => setAction('withdraw')}
              >
                برداشت
              </button>
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">مبلغ ({action === 'deposit' ? 'واریز' : 'برداشت'})</label>
              <input
                type="text"
                inputMode="numeric"
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
                placeholder="مثلاً 500"
                value={formatWithCommas(amount)}
                onChange={handleAmountChange}
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer py-3 rounded-lg font-bold text-lg transition bg-[var(--main-color)] text-white hover:bg-[var(--main-color-dark)]"
            >
              {action === 'deposit' ? 'واریز' : 'برداشت'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-8 text-red-500">کاربر یافت نشد.</div>
      )}
    </div>
  );
}

