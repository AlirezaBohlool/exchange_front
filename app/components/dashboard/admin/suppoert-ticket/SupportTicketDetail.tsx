"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, Send, MessageCircle, User, Shield, Clock } from "lucide-react"
import { get, post, patch } from "~/services/api"
import { useSnackbar } from "~/components/common/Snackbar"

interface SupportTicket {
  ticket_id: number
  user_id: number
  user_email?: string
  user_name?: string
  subject: string
  message: string
  created_at: string
  status?: "open" | "pending" | "closed"
  priority?: "low" | "medium" | "high" | "urgent"
}

interface TicketReply {
  id: number
  ticket_id: number
  message: string
  sender_type: "user" | "admin"
  sender_name?: string
  created_at: string
}

export default function SupportTicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [replies, setReplies] = useState<TicketReply[]>([])
  const [newReply, setNewReply] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (ticketId) {
      loadTicketData()
      // Auto-refresh every 10 seconds for real-time updates
    //   const interval = setInterval(loadTicketData, 10000)
    //   return () => clearInterval(interval)
    }
  }, [ticketId])

  const loadTicketData = async () => {
    setLoading(true)
    try {
      // Get ticket details from all tickets endpoint
      const allTicketsResponse = await get("/dashboard/tickets/")
      let allTickets = []

      if (Array.isArray(allTicketsResponse.data)) {
        allTickets = allTicketsResponse.data
      } else if (allTicketsResponse.data && Array.isArray(allTicketsResponse.data.tickets)) {
        allTickets = allTicketsResponse.data.tickets
      }

      const foundTicket = allTickets.find((t: any) => t.ticket_id === Number(ticketId))

      if (foundTicket) {
        setTicket(foundTicket)

        // Load replies
        const repliesResponse = await get(`/dashboard/ticket/reply/${ticketId}`)
        setReplies(repliesResponse.data || [])

        // Mark as read for support team
        try {
          await get(`/dashboard/ticket/${ticketId}/mark-read`, {})
        } catch (error) {
          console.error("Error marking as read:", error)
        }
      } else {
        showSnackbar("تیکت یافت نشد", "error")
        navigate("/support/tickets")
      }
    } catch (error) {
      console.error("Error loading support ticket:", error)
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
        sender_type: "admin",
      })

      // Update ticket status to pending (waiting for user response)
      // await updateTicketStatus("pending")

      // Refresh replies
      const repliesResponse = await get(`/dashboard/ticket/reply/${ticketId}`)
      setReplies(repliesResponse.data || [])

      setNewReply("")
      showSnackbar("پاسخ با موفقیت ارسال شد", "success")
    } catch (error) {
      console.error("Error sending support reply:", error)
      showSnackbar("خطا در ارسال پاسخ", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const updateTicketStatus = async (newStatus: "open" | "pending" | "closed") => {
    setUpdatingStatus(true)
    try {
      await post(`/dashboard/ticket/${ticketId}/close`, {
        status: newStatus,
      })

      setTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
      showSnackbar(`وضعیت تیکت به "${getStatusText(newStatus)}" تغییر یافت`, "success")
    } catch (error) {
      console.error("Error updating ticket status:", error)
      showSnackbar("خطا در تغییر وضعیت تیکت", "error")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const updateTicketPriority = async (newPriority: "low" | "medium" | "high" | "urgent") => {
    try {
      await patch(`/dashboard/ticket/${ticketId}/priority`, {
        priority: newPriority,
      })

      setTicket((prev) => (prev ? { ...prev, priority: newPriority } : null))
      showSnackbar(`اولویت تیکت به "${getPriorityText(newPriority)}" تغییر یافت`, "success")
    } catch (error) {
      console.error("Error updating ticket priority:", error)
      showSnackbar("خطا در تغییر اولویت تیکت", "error")
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case "open":
        return "نیاز به پاسخ"
      case "pending":
        return "منتظر کاربر"
      case "closed":
        return "بسته شده"
      default:
        return "جدید"
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "فوری"
      case "high":
        return "بالا"
      case "medium":
        return "متوسط"
      case "low":
        return "پایین"
      default:
        return "عادی"
    }
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => navigate("/dashboard/support/tickets/")}
            className="flex justify-end w-full items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 lg:mb-6 transition-colors duration-200 p-2 -mr-2 rounded-lg cursor-pointer"
          >
            <span className=" sm:inline">بازگشت به لیست تیکت‌ها</span> 
            <ArrowLeft size={20} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-[var(--font-morabba)] mb-3 leading-tight">
                      {ticket.subject}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        تیکت #{ticket.ticket_id}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>{ticket.user_name || `کاربر ${ticket.user_id}`}</span>
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

            {/* Ticket Controls */}
            <div className="hidden lg:block space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">وضعیت تیکت</h3>
                <div className="space-y-2">
                  <div className={`px-3 py-2 rounded-lg text-center font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => updateTicketStatus("open")}
                      disabled={updatingStatus || ticket.status === "open"}
                      className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      نیاز به پاسخ
                    </button>
                    <button
                      onClick={() => updateTicketStatus("pending")}
                      disabled={updatingStatus || ticket.status === "pending"}
                      className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      منتظر کاربر
                    </button>
                    <button
                      onClick={() => updateTicketStatus("closed")}
                      disabled={updatingStatus || ticket.status === "closed"}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      بستن تیکت
                    </button>
                  </div>
                </div>
              </div> 

               {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">اولویت</h3>
                <div className="space-y-2">
                  <div className={`px-3 py-2 rounded-lg text-center font-medium ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)}
                  </div>
                  <select
                    value={ticket.priority || "medium"}
                    onChange={(e) => updateTicketPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none"
                  >
                    <option value="low">پایین</option>
                    <option value="medium">متوسط</option>
                    <option value="high">بالا</option>
                    <option value="urgent">فوری</option>
                  </select>
                </div>
              </div>  */}
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 lg:space-y-6 mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 font-[var(--font-morabba)] px-2">
            مکالمات ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">هنوز پاسخی ارسال نشده</p>
              <p className="text-gray-400 text-sm mt-2">اولین پاسخ را ارسال کنید</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 ${
                    reply.sender_type === "admin"
                      ? "border-r-4 border-r-[var(--main-color)] bg-gradient-to-r from-green-50 to-white"
                      : "border-r-4 border-r-blue-500 bg-gradient-to-r from-blue-50 to-white"
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
                          <div className="p-2 bg-blue-100 rounded-full">
                            <User size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-blue-700 text-sm lg:text-base">
                              {ticket.user_name || `کاربر ${ticket.user_id}`}
                            </span>
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

        {/* Reply Form */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky bottom-4 lg:static">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[var(--font-morabba)]">پاسخ پشتیبانی</h3>
          <form onSubmit={handleSendReply} className="space-y-4">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200 resize-none text-sm lg:text-base"
              placeholder="پاسخ خود را به کاربر اینجا بنویسید..."
              disabled={submitting}
              maxLength={2000}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500">{newReply.length}/2000 کاراکتر</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateTicketStatus("closed")}
                  disabled={updatingStatus || ticket.status === "closed"}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  بستن تیکت
                </button>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
