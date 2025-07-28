"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { MessageCircle, Clock, Search, User, AlertCircle, CheckCircle } from "lucide-react"
import { get } from "~/services/api"
import { useSnackbar } from "~/components/common/Snackbar"

interface SupportTicket {
  ticket_id: number
  user_id: number
  user_email?: string
  user_name?: string
  subject: string
  message: string
  created_at: string
  last_reply_at?: string
  status?: "open" | "pending" | "closed"
  priority?: "low" | "medium"
  unread_count?: number
  last_message_sender?: "user" | "admin"
}

export default function SupportTicketList() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    fetchAllTickets()
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchAllTickets, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllTickets = async () => {
    setLoading(true)
    try {
      // API endpoint صحیح برای دریافت همه تیکت‌ها
      const response = await get("/dashboard/tickets")

      let ticketData: SupportTicket[] = []
      if (Array.isArray(response.data)) {
        ticketData = response.data
      } else if (response.data && Array.isArray(response.data.tickets)) {
        ticketData = response.data.tickets
      }

      // Sort by priority and unread messages first, then by creation date
      ticketData.sort((a, b) => {
        // First, prioritize tickets with unread messages
        if (a.unread_count && !b.unread_count) return -1
        if (!a.unread_count && b.unread_count) return 1

        // Then by priority - حذف urgent و high
        const priorityOrder = { medium: 2, low: 1 }
        const aPriority = priorityOrder[a.priority || "medium"] || 1
        const bPriority = priorityOrder[b.priority || "medium"] || 1
        if (aPriority !== bPriority) return bPriority - aPriority

        // Finally by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setTickets(ticketData)
    } catch (error) {
      console.error("Error fetching support tickets:", error)
      showSnackbar("خطا در دریافت لیست تیکت‌ها", "error")
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 24) {
        return new Intl.DateTimeFormat("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(date)
      } else {
        return new Intl.DateTimeFormat("fa-IR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date)
      }
    } catch (error) {
      return dateString
    }
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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "open":
        return <AlertCircle size={16} />
      case "pending":
        return <Clock size={16} />
      case "closed":
        return <CheckCircle size={16} />
      default:
        return <MessageCircle size={16} />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
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
      case "medium":
        return "متوسط"
      case "low":
        return "پایین"
      default:
        return "عادی"
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_id.toString().includes(searchTerm)

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleTicketClick = (ticketId: number) => {
    navigate(`/dashboard/support/tickets/${ticketId}`)
  }

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    unread: tickets.reduce((sum, t) => sum + (t.unread_count || 0), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری تیکت‌ها...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-[var(--font-morabba)]">پنل پشتیبانی</h1>
            {stats.unread > 0 && (
              <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                {stats.unread} پیام جدید
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">کل تیکت‌ها</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageCircle className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">نیاز به پاسخ</p>
                  <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                </div>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">منتظر کاربر</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">پیام‌های جدید</p>
                  <p className="text-2xl font-bold text-green-600">{stats.unread}</p>
                </div>
                <User className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در تیکت‌ها، ایمیل کاربر یا شماره تیکت..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="open">نیاز به پاسخ</option>
              <option value="pending">منتظر کاربر</option>
              <option value="closed">بسته شده</option>
            </select>

            {/* Priority Filter */}
            {/* <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200"
            >
              <option value="all">همه اولویت‌ها</option>
              <option value="medium">متوسط</option>
              <option value="low">پایین</option>
            </select> */}
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12 max-w-md mx-auto">
              <MessageCircle size={64} className="mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-600 mb-4 font-[var(--font-morabba)]">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "هیچ تیکتی با این فیلتر یافت نشد"
                  : "هیچ تیکتی وجود ندارد"}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "فیلترها را تغییر دهید یا جستجوی جدیدی انجام دهید"
                  : "هنوز هیچ تیکتی ثبت نشده است"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:gap-6">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                onClick={() => handleTicketClick(ticket.ticket_id)}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-200 p-4 lg:p-6 cursor-pointer group relative ${
                  ticket.unread_count && ticket.unread_count > 0
                    ? "border-red-300 ring-2 ring-red-100 hover:shadow-xl"
                    : "border-gray-200 hover:shadow-lg hover:border-[var(--main-color)]"
                }`}
              >
                {/* Unread indicator */}
                {ticket.unread_count && ticket.unread_count > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {ticket.unread_count > 9 ? "9+" : ticket.unread_count}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <MessageCircle
                        className={`group-hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-1 ${
                          ticket.unread_count && ticket.unread_count > 0 ? "text-red-500" : "text-[var(--main-color)]"
                        }`}
                        size={20}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 font-[var(--font-morabba)] line-clamp-1">
                            {ticket.subject || "بدون موضوع"}
                          </h3>
                          {ticket.unread_count && ticket.unread_count > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                              جدید
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm lg:text-base line-clamp-2 leading-relaxed mb-2">
                          {ticket.message || "بدون متن"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={14} />
                          <span>{ticket.user_name || `کاربر ${ticket.user_id}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        #{ticket.ticket_id}
                      </span>
                      {ticket.last_reply_at && (
                        <span className="text-green-600 text-xs">آخرین پاسخ: {formatDate(ticket.last_reply_at)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-3">
                    {/* Priority Badge */}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(ticket.status)}`}
                    >
                      {getStatusIcon(ticket.status)}
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
