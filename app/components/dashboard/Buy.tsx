import React, { useState } from 'react';
import { post } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

const coins = [
  { label: 'بیت کوین', value: 'bitcoin' },
  { label: 'تتر', value: 'tether' },
  { label: 'ترون', value: 'tron' },
  { label: 'کاردانو', value: 'cardano' },
];

// Example prices for each coin (in Toman)
const coinPrices: Record<string, number> = {
  bitcoin: 4000000000,
  tether: 90000,
  tron: 2500,
  cardano: 15000,
};

export default function Buy() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [lastChanged, setLastChanged] = useState<'amount' | 'price'>('amount');
  const { showSnackbar } = useSnackbar();
  // TODO: Replace with actual user id from auth context or props
  const userId = 1;

  // Update price/amount when coin or price changes
  React.useEffect(() => {
    const unitPrice = coinPrices[selectedCoin] || 0;
    if (lastChanged === 'amount') {
      if (amount && !isNaN(Number(amount))) {
        setPrice((Number(amount) * unitPrice).toLocaleString());
      } else {
        setPrice('');
      }
    } else if (lastChanged === 'price') {
      if (price && unitPrice && !isNaN(Number(price.replace(/,/g, '')))) {
        setAmount((Number(price.replace(/,/g, '')) / unitPrice).toFixed(6));
      } else {
        setAmount('');
      }
    }
    // eslint-disable-next-line
  }, [selectedCoin, amount, price]);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    setLastChanged('amount');
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    setLastChanged('price');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!amount || !price || isNaN(Number(amount)) || isNaN(Number(price.replace(/,/g, '')))) {
      showSnackbar('لطفاً مقدار و مبلغ معتبر وارد کنید', 'error');
      return;
    }
    try {
      const res = await post(
        'dashboard/transactions/buy',
        {
          user_id: userId,
          coin: coins.find(c => c.value === selectedCoin)?.label || selectedCoin,
          amount: Number(amount),
          price: Number(price.replace(/,/g, '')),
          transaction_type: 'buy',
        }
      );
      // Accept any 2xx as success, or if backend returns no error
      if (res && res.status && res.status >= 200 && res.status < 300) {
        showSnackbar('خرید با موفقیت انجام شد', 'success');
        setAmount('');
        setPrice('');
      } else {
        showSnackbar('خرید انجام نشد. لطفاً دوباره تلاش کنید.', 'error');
      }
    } catch (err: any) {
      // Try to show backend error if available
      if (err?.response?.data?.message) {
        showSnackbar(err.response.data.message, 'error');
      } else {
        showSnackbar('خطا در ارتباط با سرور', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-morabba">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow p-6 font-morabba">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--main-color)]">خرید ارز دیجیتال</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Coin Selector */}
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">انتخاب ارز</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {coins.map((coin) => (
                <button
                  type="button"
                  key={coin.value}
                  className={`py-2 px-2 rounded-lg font-bold border transition text-sm cursor-pointer ${
                    selectedCoin === coin.value
                      ? 'bg-[var(--main-color)] text-white border-[var(--main-color)]'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-[var(--main-color)]'
                  }`}
                  onClick={() => setSelectedCoin(coin.value)}
                >
                  {coin.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">مقدار ({coins.find(c => c.value === selectedCoin)?.label})</label>
            <input
              type="number"
              min="0"
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
              placeholder="مثلاً 0.5"
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
            />
          </div>

          {/* Price Input */}
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">مبلغ (تومان)</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] text-right font-morabba"
              placeholder="مثلاً ۱۰۰,۰۰۰"
              value={price}
              onChange={e => handlePriceChange(e.target.value.replace(/[^\d]/g, ''))}
            />
          </div>

          {/* Buy Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white font-bold py-3 rounded-lg transition text-lg mt-4 font-morabba"
          >
            خرید {coins.find(c => c.value === selectedCoin)?.label}
          </button>
        </form>
      </div>
    </div>
  );
}
