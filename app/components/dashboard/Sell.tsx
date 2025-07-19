import React, { useState } from 'react';

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

export default function Sell() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [lastChanged, setLastChanged] = useState<'amount' | 'price'>('amount');

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-morabba">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow p-6 font-morabba">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500">فروش ارز دیجیتال</h2>
        <form className="space-y-6">
          {/* Coin Selector */}
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">انتخاب ارز</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {coins.map((coin) => (
                <button
                  type="button"
                  key={coin.value}
                  className={`py-2 px-2 rounded-lg font-bold border transition text-sm ${
                    selectedCoin === coin.value
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-red-500'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right font-morabba"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right font-morabba"
              placeholder="مثلاً ۱۰۰,۰۰۰"
              value={price}
              onChange={e => handlePriceChange(e.target.value.replace(/[^\d]/g, ''))}
            />
          </div>

          {/* Sell Button */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition text-lg mt-4 font-morabba"
          >
            فروش {coins.find(c => c.value === selectedCoin)?.label}
          </button>
        </form>
      </div>
    </div>
  );
}
