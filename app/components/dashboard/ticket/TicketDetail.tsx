"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, Send, MessageCircle, User, Shield, Clock } from "lucide-react"
import { get, post } from "~/services/api"
import { useSnackbar } from "~/components/common/Snackbar"

interface Ticket {
    id: number
    user_id: number
    subject: string
    message: string
    created_at: string
}

interface TicketReply {
    id: number
    ticket_id: number
    message: string
    sender_type: "user" | "admin"
    created_at: string
}

export default function TicketDetail() {
    const { ticketId } = useParams()
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()


    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [replies, setReplies] = useState<TicketReply[]>([])
    const [newReply, setNewReply] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (ticketId) {
            loadTicketData()
        }
    }, [ticketId])

    let userId: any = ''
    if (typeof window !== 'undefined') {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                userId = userObj.user_id || '';
            }
        } catch (e) {
            userId = '';
        }
    }
    const loadTicketData = async () => {
        setLoading(true)
        try {
            // بارگذاری اطلاعات تیکت
            const ticketsResponse = await get(`/dashboard/ticket/reply/${ticketId}`)

            const normalizedTickets: Ticket[] = ticketsResponse.data.map((t: any) => ({
                id: t.ticket_id,
                user_id: t.user_id,
                subject: t.subject,
                message: t.message,
                created_at: t.created_at,
            }))

            const foundTicket = normalizedTickets.find((t) => t.id === Number(ticketId))

            if (foundTicket) {
                setTicket(foundTicket)

                // بارگذاری پاسخ‌ها
                const repliesResponse = await get(`/dashboard/ticket/reply/${ticketId}`)
                setReplies(repliesResponse.data || [])
            } else {
                showSnackbar("تیکت یافت نشد", "error")
                navigate("/dashboard/tickets/")
            }
        } catch (error) {
            console.error("Error loading ticket:", error)
            showSnackbar("خطا در بارگذاری اطلاعات تیکت", "error")
        } finally {
            setLoading(false)
        }
    }


    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newReply.trim()) {
            showSnackbar("لطفاً پیام خود را وارد کنید", "error")
            return
        }

        setSubmitting(true)
        try {
            await post("/dashboard/ticket/reply", {
                ticket_id: Number(ticketId),
                message: newReply.trim(),
                sender_type: "user",
            })

            // بروزرسانی پاسخ‌ها
            const repliesResponse = await get(`/dashboard/ticket/reply/${ticketId}`)
            setReplies(repliesResponse.data || [])

            setNewReply("")
            showSnackbar("پاسخ با موفقیت ارسال شد", "success")
        } catch (error) {
            console.error("Error sending reply:", error)
            showSnackbar("خطا در ارسال پاسخ", "error")
        } finally {
            setSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
                    <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
                </div>
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">تیکت یافت نشد</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
                {/* هدر */}
                <div className="mb-6 lg:mb-8">
                    <button
                        onClick={() => navigate("/dashboard/tickets")}
                        className="flex justify-end  w-full cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 lg:mb-6 transition-colors duration-200 p-2 -mr-2 rounded-lg "
                    >
                        <span className=" sm:inline">بازگشت به لیست تیکت‌ها</span>
                        <ArrowLeft size={20} />
                    </button>

                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-[var(--font-morabba)] mb-3 leading-tight">
                                    {ticket.subject}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                        تیکت #{ticket.id}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{formatDate(ticket.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                            <MessageCircle className="text-[var(--main-color)] flex-shrink-0" size={28} />
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">{ticket.message}</p>
                        </div>
                    </div>
                </div>

                {/* پاسخ‌ها */}
                <div className="space-y-4 lg:space-y-6 mb-6 lg:mb-8">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 font-[var(--font-morabba)] px-2">
                        پاسخ‌ها ({replies.length})
                    </h2>

                    {replies.length === 0 ? (
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 text-center">
                            <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">هنوز پاسخی دریافت نکرده‌اید</p>
                            <p className="text-gray-400 text-sm mt-2">پاسخ اول خود را ارسال کنید</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 ${reply.sender_type === "admin"
                                        ? "border-r-4 border-r-[var(--main-color)] bg-gradient-to-r from-green-50 to-white"
                                        : ""
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                        <div className="flex items-center gap-3">
                                            {reply.sender_type === "admin" ? (
                                                <>
                                                    <div className="p-2 bg-[var(--main-color)] bg-opacity-10 rounded-full">
                                                        <Shield size={18} className="text-[var(--main-color)]" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-[var(--main-color)] text-sm lg:text-base">
                                                            تیم پشتیبانی
                                                        </span>
                                                        <p className="text-xs text-gray-500">ادمین</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-2 bg-gray-100 rounded-full">
                                                        <User size={18} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700 text-sm lg:text-base">شما</span>
                                                        <p className="text-xs text-gray-500">کاربر</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <span className="text-xs lg:text-sm text-gray-500">{formatDate(reply.created_at)}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 lg:p-5">
                                        <p className="text-gray-700 leading-relaxed text-sm lg:text-base">{reply.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* فرم پاسخ جدید */}
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky bottom-4 lg:static">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[var(--font-morabba)]">پاسخ جدید</h3>
                    <form onSubmit={handleSendReply} className="space-y-4">
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200 resize-none text-sm lg:text-base"
                            placeholder="پاسخ خود را اینجا بنویسید..."
                            disabled={submitting}
                            maxLength={1000}
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="text-xs text-gray-500">{newReply.length}/1000 کاراکتر</p>
                            <button
                                type="submit"
                                disabled={submitting || !newReply.trim()}
                                className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        در حال ارسال...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        ارسال پاسخ
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
