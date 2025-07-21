import React, { useEffect, useState } from 'react';
import { get, patch } from '../../services/api';
import { useSnackbar } from '../common/Snackbar';

interface Transaction {
  transaction_id: number;
  user_id: number;
  amount: number;
  transaction_type: string;
  status: string;
  description: string;
  persian_date: string;
  to_card: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function PendingRequests() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showSnackbar } = useSnackbar();

  const fetchPendingTransactions = () => {
    setLoading(true);
    get('/admin/transactions/pending')
      .then(res => {
        if (res.data && Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
        } else {
          setTransactions([]);
        }
      })
      .catch(() => setError('خطا در دریافت اطلاعات تراکنش‌ها'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const handleUpdateStatus = async (transaction_id: number, status: 'approved' | 'rejected') => {
    try {
      await patch(`/admin/transactions/${transaction_id}/status`, { status });
      showSnackbar('وضعیت تراکنش با موفقیت بروزرسانی شد.', 'success');
      // Refresh the list after updating
      fetchPendingTransactions();
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || 'خطا در بروزرسانی وضعیت تراکنش', 'error');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-6 font-morabba mt-14">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-[var(--main-color)]">درخواست‌های در انتظار</h2>
      {loading ? (
        <div className="text-center py-8">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">درخواستی در انتظار یافت نشد.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-xs sm:text-base bg-white">
            <thead className="bg-gray-100 hidden sm:table-header-group">
              <tr>
                <th className="py-2 px-2 sm:px-4">#</th>
                <th className="py-2 px-2 sm:px-4">کاربر</th>
                <th className="py-2 px-2 sm:px-4">نوع</th>
                <th className="py-2 px-2 sm:px-4">مقدار</th>
                <th className="py-2 px-2 sm:px-4">شماره کارت</th>
                <th className="py-2 px-2 sm:px-4">تاریخ</th>
                <th className="py-2 px-2 sm:px-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={tx.transaction_id} className="border-b last:border-b-0 hover:bg-gray-50 transition sm:table-row block sm:mb-0 mb-4 rounded-lg sm:rounded-none bg-white sm:bg-transparent shadow-sm sm:shadow-none">
                  {/* Desktop cells */}
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">{idx + 1}</td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">{tx.user_id}</td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">
                    <span className={
                      tx.transaction_type === 'deposit'
                        ? 'text-green-600 font-bold'
                        : 'text-red-600 font-bold'
                    }>
                      {tx.transaction_type === 'deposit' ? 'واریز' : 'برداشت'}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">{Number(tx.amount).toLocaleString()}</td>
                  <td className="py-2 px-2 sm:px-4 text-center whitespace-nowrap hidden sm:table-cell">{tx.to_card || '-'}</td>
                  <td className="py-2 px-2 sm:px-4 text-center whitespace-nowrap hidden sm:table-cell">{tx.persian_date}</td>
                  <td className="py-2 px-2 sm:px-4 text-center hidden sm:table-cell">
                    <button onClick={() => handleUpdateStatus(tx.transaction_id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition text-xs">تایید</button>
                    <button onClick={() => handleUpdateStatus(tx.transaction_id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-xs mr-2">رد</button>
                  </td>

                  {/* Mobile stacked view */}
                  <td className="block sm:hidden p-3 text-right align-top" colSpan={7}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">کاربر:</span>
                      <span>{tx.user_id}</span>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">نوع:</span>
                      <span className={tx.transaction_type === 'deposit' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {tx.transaction_type === 'deposit' ? 'واریز' : 'برداشت'}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">مقدار:</span>
                      <span>{Number(tx.amount).toLocaleString()}</span>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">شماره کارت:</span>
                      <span>{tx.to_card || '-'}</span>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">تاریخ:</span>
                      <span>{tx.persian_date}</span>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                      <button onClick={() => handleUpdateStatus(tx.transaction_id, 'approved')} className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm">تایید</button>
                      <button onClick={() => handleUpdateStatus(tx.transaction_id, 'rejected')} className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm mr-2">رد</button>
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