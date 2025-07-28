"use client"

import type React from "react"
import { useState } from "react"
import { X, Send } from "lucide-react"
import { post } from "~/services/api"
import { useSnackbar } from "~/components/common/Snackbar"

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated: () => void
  userId: number
}

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated, userId }: CreateTicketModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSnackbar } = useSnackbar()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      showSnackbar("لطفاً همه فیلدها را پر کنید", "error")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await post("/dashboard/ticket", {
        user_id: userId,
        subject: subject.trim(),
        message: message.trim(),
      })

      if (response.data.ticket_id) {
        showSnackbar("تیکت با موفقیت ایجاد شد", "success")
        setSubject("")
        setMessage("")
        onClose()
        onTicketCreated()
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      showSnackbar("خطا در ایجاد تیکت", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSubject("")
      setMessage("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-[var(--font-morabba)]">ایجاد تیکت جدید</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors duration-200 disabled:opacity-50"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* محتوای مودال */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                موضوع تیکت *
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200"
                placeholder="مثال: مشکل در ورود به حساب کاربری"
                disabled={isSubmitting}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{subject.length}/100 کاراکتر</p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="توضیح کاملی از مشکل یا درخواست خود ارائه دهید..."
                disabled={isSubmitting}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/1000 کاراکتر</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !message.trim()}
                className="flex-1 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    ایجاد تیکت
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
