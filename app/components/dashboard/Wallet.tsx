import React, { useEffect, useState } from 'react';
import { get, post } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

interface UserInfo {
  user_id: number;
  user_balance: number;
  [key: string]: any;
}

const walletAddress = 'TTDsmd1pjKd9ufcifx4b2JT97tX4P81XJ7';

export default function Wallet() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [cardNumber, setCardNumber] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [savedCards, setSavedCards] = useState<{ bank_id: number; bank_name: string; bank_number: string; card_holder: string; is_active: number; created_at: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [showDepositSuccessModal, setShowDepositSuccessModal] = useState(false);
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Get user_id from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.user_id) {
          fetchUserInfo(userObj.user_id);
          // Fetch cards for withdraw
          fetchUserCards(userObj.user_id);
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

  const fetchUserCards = async (user_id: number) => {
    setCardsLoading(true);
    try {
      const res = await get(`/dashboard/bank/${user_id}`);
      setSavedCards(res.data.cards || []);
    } catch {
      setSavedCards([]);
    } finally {
      setCardsLoading(false);
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
      if (action === 'deposit') {
        const payload = { user_id: user.user_id, amount: amt };
        await post('/dashboard/deposit', payload);
        setShowDepositSuccessModal(true);
        setAmount('');
      } else { // action === 'withdraw'
        let toCardValue = cardNumber;
        if (useSavedCard && selectedCardId) {
          const selected = savedCards.find(c => c.bank_id === selectedCardId);
          if (selected) {
            toCardValue = selected.bank_number;
          }
        }
        if (!toCardValue) {
          showSnackbar('لطفاً شماره کارت را وارد یا انتخاب کنید.', 'error');
          return;
        }

        const payload = { user_id: user.user_id, amount: amt, to_card: toCardValue };
        await post('/dashboard/withdraw', payload);
        setShowWithdrawSuccessModal(true);
        setAmount('');
        setCardNumber('');
      }
    } catch (err: any) {
      showSnackbar(
        err?.response?.data?.message || 'خطا در انجام عملیات',
        'error'
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      showSnackbar('آدرس کیف پول کپی شد!', 'success');
    }, () => {
      showSnackbar('خطا در کپی کردن آدرس', 'error');
    });
  };

  // Helper to format with commas
  const formatWithCommas = (value: string | number) => {
    const num = typeof value === 'string' ? value.replace(/,/g, '') : value;
    if (!num || isNaN(Number(num))) return '';
    return Number(num).toLocaleString('en-US'); // you can change 'en-US' if needed
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba placeholder:text-gray-400"
                placeholder="مثلاً ۵۰۰"
                value={amount}
                onChange={handleAmountChange}
              />

              {amount && (
                <div className="text-sm text-gray-500 text-right mt-1 font-morabba">
                  مبلغ وارد شده: {formatWithCommas(amount)} تومان
                </div>
              )}
            </div>
            {action === 'withdraw' && (
              <>
                {savedCards.length > 0 && (
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useSavedCard"
                      checked={useSavedCard}
                      onChange={e => setUseSavedCard(e.target.checked)}
                    />
                    <label htmlFor="useSavedCard" className="text-sm cursor-pointer select-none">انتخاب از کارت‌های من</label>
                  </div>
                )}
                {useSavedCard && savedCards.length > 0 ? (
                  <div>
                    <label className="block mb-2 text-gray-700 font-semibold">کارت ثبت شده</label>
                    {cardsLoading ? (
                      <div className="text-gray-500 text-sm">در حال بارگذاری کارت‌ها...</div>
                    ) : (
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
                        value={selectedCardId ?? ''}
                        onChange={e => setSelectedCardId(Number(e.target.value))}
                      >
                        <option value="">انتخاب کارت</option>
                        {savedCards.map(card => (
                          <option key={card.bank_id} value={card.bank_id}>
                            {card.bank_number} - {card.bank_name} ({card.card_holder})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 text-gray-700 font-semibold">شماره کارت بانکی</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
                      placeholder="مثلاً 6037********1234"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 16))}
                      maxLength={16}
                    />
                  </div>
                )}
              </>
            )}
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

      {showDepositSuccessModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center font-morabba">
            <h3 className="text-xl font-bold text-[var(--main-color)] mb-4">درخواست واریز ثبت شد</h3>
            <p className="text-gray-700 mb-4 text-right leading-relaxed">
              درخواست شما با موفقیت ثبت شد و پس از بررسی و انتقال وجه به آدرس کیف پول زیر، کیف پول شما شارژ خواهد شد.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between gap-4 mb-4">
              <button
                onClick={handleCopy}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded text-xs transition whitespace-nowrap"
              >
                کپی
              </button>
              <span className="text-sm font-mono break-all text-left">
                {walletAddress}
              </span>
            </div>
            <button
              onClick={() => {
                setShowDepositSuccessModal(false);
                if (user) fetchUserInfo(user.user_id);
              }}
              className="w-full bg-main text-white font-semibold cursor-pointer bg-[var(--main-color)] py-2 px-4 rounded-lg hover:bg-main-dark transition"
            >
              بازگشت
            </button>
          </div>
        </div>
      )}

      {showWithdrawSuccessModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center font-morabba">
            <h3 className="text-xl font-bold text-[var(--main-color)] mb-4">درخواست برداشت ثبت شد</h3>
            <p className="text-gray-700 mb-4 text-right leading-relaxed">
              درخواست شما ثبت شد و پس از بررسی رد سیکل های پرداختی انتقال داده می شود .
            </p>
            <button
              onClick={() => {
                setShowWithdrawSuccessModal(false);
                if (user) fetchUserInfo(user.user_id);
              }}
              className="w-full bg-main text-white font-semibold cursor-pointer bg-[var(--main-color)] py-2 px-4 rounded-lg hover:bg-main-dark transition"
            >
              بازگشت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

