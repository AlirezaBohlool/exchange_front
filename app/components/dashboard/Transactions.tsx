import React, { useEffect, useState } from 'react';
import { get } from '../../services/api';

interface Transaction {
  transaction_id: number;
  user_id: number;
  amount: string;
  coin: string;
  transaction_type: string;
  status: string;
  description: string;
  persian_date: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // user is stored as a JSON string in localStorage
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userId = userObj.user_id;
      } catch {
        userId = null;
      }
    }
    if (!userId) {
      setError('کاربر یافت نشد.');
      setLoading(false);
      return;
    }
    get(`/dashboard/transactions/history/${userId}`)
      .then(res => {
        if (res.data && Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
        } else if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else {
          setTransactions([]);
        }
      })
      .catch(() => setError('خطا در دریافت اطلاعات تراکنش‌ها'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-6 font-morabba mt-14">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-[var(--main-color)]">تاریخچه تراکنش‌ها</h2>
      {loading ? (
        <div className="text-center py-8">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">تراکنشی یافت نشد.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-xs sm:text-base bg-white">
            <thead className="bg-gray-100 hidden sm:table-header-group">
              <tr>
                <th className="py-2 px-2 sm:px-4">#</th>
                <th className="py-2 px-2 sm:px-4">ارز</th>
                <th className="py-2 px-2 sm:px-4">نوع</th>
                <th className="py-2 px-2 sm:px-4">مقدار</th>
                <th className="py-2 px-2 sm:px-4">توضیحات</th>
                <th className="py-2 px-2 sm:px-4">تاریخ</th>
                <th className="py-2 px-2 sm:px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={tx.transaction_id} className="border-b last:border-b-0 hover:bg-gray-50 transition sm:table-row block sm:mb-0 mb-4 rounded-lg sm:rounded-none bg-white sm:bg-transparent shadow-sm sm:shadow-none">
                  {/* Desktop cells */}
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">{idx + 1}</td>
                  <td className="py-2 px-2 sm:px-4 text-center whitespace-nowrap hidden sm:table-cell">{tx.coin}</td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">
                    <span className={
                      tx.transaction_type === 'buy'
                        ? 'text-green-600 font-bold'
                        : 'text-red-600 font-bold'
                    }>
                      {tx.transaction_type === 'buy' ? 'خرید' : 'فروش'}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">{Number(tx.amount).toLocaleString()}</td>
                  <td className="py-2 px-2 sm:px-4 text-center max-w-[120px] truncate hidden sm:table-cell" title={tx.description}>{tx.description}</td>
                  <td className="py-2 px-2 sm:px-4 text-center whitespace-nowrap hidden sm:table-cell">{tx.persian_date}</td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded text-xs sm:text-sm font-semibold ${statusColors[tx.status] || 'bg-[var(--main-color)] text-gray-100'}`}>
                      {tx.status === 'pending' ? 'در انتظار' : tx.status === 'approved' ? 'موفق' : 'ناموفق'}
                    </span>
                  </td>
                  {/* Mobile stacked view */}
                  <td className="block sm:hidden p-3 text-right align-top" colSpan={7}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold">ارز:</span>
                      <span>{tx.coin}</span>
                    </div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold">نوع:</span>
                      <span className={tx.transaction_type === 'buy' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {tx.transaction_type === 'buy' ? 'خرید' : 'فروش'}
                      </span>
                    </div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold">مقدار:</span>
                      <span>{Number(tx.amount).toLocaleString()}</span>
                    </div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold">توضیحات:</span>
                      <span className="truncate max-w-[120px]" title={tx.description}>{tx.description}</span>
                    </div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-bold">تاریخ:</span>
                      <span>{tx.persian_date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">وضعیت:</span>
                      <span className={`px-2 py-1 rounded text-xs sm:text-sm font-semibold ${statusColors[tx.status] || 'bg-[var(--main-color)] text-gray-100'}`}>
                      {tx.status === 'pending' ? 'در انتظار' : tx.status === 'approved' ? 'موفق' : 'ناموفق'}
                    </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}  
    </div>
  );
}
