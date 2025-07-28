// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router"
// import { Plus, MessageCircle, Clock, Search, Mail } from "lucide-react"
// import { get } from "~/services/api"
// import { useSnackbar } from "~/components/common/Snackbar"
// import CreateTicketModal from "./CreateTicketModal"

// interface Ticket {
//   ticket_id: number
//   user_id: number
//   subject: string
//   message: string
//   created_at: string
//   unread_count?: number // New field for unread messages
//   last_reply_at?: string // When support team last replied
//   status?: 'open' | 'pending' | 'closed' // Ticket status
// }

// export default function TicketList() {
//   const [tickets, setTickets] = useState<Ticket[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const navigate = useNavigate()
//   const { showSnackbar } = useSnackbar()

//   // Get user ID from localStorage
//   let userId: any = ''
//   if (typeof window !== 'undefined') {
//     try {
//       const userStr = localStorage.getItem('user');
//       if (userStr) {
//         const userObj = JSON.parse(userStr);
//         userId = userObj.user_id || '';
//       }
//     } catch (e) {
//       userId = '';
//     }
//   }

//   useEffect(() => {
//     fetchTickets()
//     // Set up polling for real-time updates every 30 seconds
//     const interval = setInterval(fetchTickets, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   const fetchTickets = async () => {
//     setLoading(true)
//     try {
//       // Updated API call to include unread count
//       const response = await get(`/dashboard/ticket/${userId}?include_unread=true`)

//       let ticketData: Ticket[] = []

//       if (Array.isArray(response.data)) {
//         ticketData = response.data
//       } else if (response.data && Array.isArray(response.data.tickets)) {
//         ticketData = response.data.tickets
//       } else if (response.data && typeof response.data === "object") {
//         const possibleArrays = Object.values(response.data).filter(Array.isArray)
//         if (possibleArrays.length > 0) {
//           ticketData = possibleArrays[0] as Ticket[]
//         }
//       }

//       setTickets(ticketData)

//       if (ticketData.length === 0) {
//         console.log("No tickets found")
//       }
//     } catch (error) {
//       showSnackbar("خطا در دریافت لیست تیکت‌ها", "error")
//       setTickets([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString)
//       return new Intl.DateTimeFormat("fa-IR", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       }).format(date)
//     } catch (error) {
//       return dateString
//     }
//   }

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'open':
//         return 'bg-green-100 text-green-800'
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800'
//       case 'closed':
//         return 'bg-gray-100 text-gray-800'
//       default:
//         return 'bg-blue-100 text-blue-800'
//     }
//   }

//   const getStatusText = (status?: string) => {
//     switch (status) {
//       case 'open':
//         return 'منتظر پاسخ'
//       case 'pending':
//         return 'پاسخ داده شده'
//       case 'closed':
//         return 'بسته شده'
//       default:
//         return 'فعال'
//     }
//   }

//   const filteredTickets = Array.isArray(tickets)
//     ? tickets.filter(
//       (ticket) =>
//         ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()),
//     )
//     : []

//   const handleTicketClick = async (ticketId: number) => {
//     // Find the ticket in local state to check its status
//     const currentTicket = tickets.find(t => t.ticket_id === ticketId)

//     if (!currentTicket) {
//       showSnackbar("تیکت یافت نشد", "error")
//       return
//     }

//     // Check if ticket has been replied to (you can adjust this logic based on your data structure)
//     const hasReplies = currentTicket.status === 'pending' || currentTicket.last_reply_at

//     if (!hasReplies && currentTicket.status === 'open') {
//       showSnackbar("تیکت شما هنوز پاسخ داده نشده است. لطفاً صبر کنید", "info")
//       return
//     }

//     // Mark messages as read when clicking on ticket
//     try {
//       await get(`/dashboard/ticket/${ticketId}/mark-read`)
//       // Update local state to remove unread count
//       setTickets(prevTickets =>
//         prevTickets.map(ticket =>
//           ticket.ticket_id === ticketId
//             ? { ...ticket, unread_count: 0 }
//             : ticket
//         )
//       )
//     } catch (error) {
//       console.error("Error marking messages as read:", error)
//       // Don't block navigation on this error
//     }

//     // Navigate to ticket detail
//     try {
//       navigate(`/dashboard/tickets/${ticketId}`)
//     } catch (error) {
//       console.error("Navigation error:", error)
//       showSnackbar("تیکت شما هنوز پاسخ داده نشده است. لطفاً صبر کنید", "info")
//     }
//   }

//   const handleTicketCreated = () => {
//     fetchTickets()
//   }

//   // Calculate total unread messages
//   const totalUnreadMessages = tickets.reduce((total, ticket) => total + (ticket.unread_count || 0), 0)

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
//           <p className="mt-4 text-gray-600">در حال بارگذاری تیکت‌ها...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 lg:p-6 mt-20">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-[var(--font-morabba)]">
//                 تیکت‌های پشتیبانی
//               </h1>
//               {totalUnreadMessages > 0 && (
//                 <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
//                   {totalUnreadMessages} پیام جدید
//                 </div>
//               )}
//             </div>
//             <p className="text-gray-600 mt-2">مشاهده و مدیریت تیکت‌های خود ({tickets.length} تیکت)</p>
//           </div>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white cursor-pointer px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
//           >
//             <Plus size={20} />
//             <span className="hidden sm:inline">تیکت جدید</span>
//           </button>
//         </div>

//         {/* Search */}
//         {Array.isArray(tickets) && tickets.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//             <div className="relative">
//               <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="جستجو در تیکت‌ها..."
//                 className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200"
//               />
//             </div>
//           </div>
//         )}

//         {/* Tickets List */}
//         {!Array.isArray(tickets) || tickets.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12 max-w-md mx-auto">
//               <MessageCircle size={64} className="mx-auto text-gray-400 mb-6" />
//               <h3 className="text-xl lg:text-2xl font-semibold text-gray-600 mb-4 font-[var(--font-morabba)]">
//                 هیچ تیکتی وجود ندارد
//               </h3>
//               <p className="text-gray-500 mb-8 leading-relaxed">
//                 برای شروع، اولین تیکت خود را ایجاد کنید و با تیم پشتیبانی در ارتباط باشید
//               </p>
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-8 py-4 rounded-xl inline-flex items-center gap-3 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
//               >
//                 <Plus size={24} />
//                 ایجاد اولین تیکت
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="grid gap-4 lg:gap-6">
//             {filteredTickets.length === 0 && searchTerm ? (
//               <div className="text-center py-12">
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//                   <Search size={48} className="mx-auto text-gray-400 mb-4" />
//                   <p className="text-gray-500">هیچ تیکتی با عبارت "{searchTerm}" یافت نشد</p>
//                   <button onClick={() => setSearchTerm("")} className="mt-4 text-[var(--main-color)] hover:underline">
//                     نمایش همه تیکت‌ها
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               filteredTickets.map((ticket) => (
//                 <div
//                   key={ticket.ticket_id}
//                   onClick={() => handleTicketClick(ticket.ticket_id)}
//                   className={`bg-white rounded-xl shadow-sm border transition-all duration-200 p-4 lg:p-6 cursor-pointer group relative ${ticket.unread_count && ticket.unread_count > 0
//                       ? 'border-red-300 ring-2 ring-red-100 hover:shadow-xl'
//                       : 'border-gray-200 hover:shadow-lg hover:border-[var(--main-color)]'
//                     }`}
//                 >
//                   {/* Unread indicator */}
//                   {ticket.unread_count && ticket.unread_count > 0 && (
//                     <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
//                       {ticket.unread_count > 9 ? '9+' : ticket.unread_count}
//                     </div>
//                   )}

//                   <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start gap-3 mb-3">
//                         <div className="relative">
//                           <MessageCircle
//                             className={`group-hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-1 ${ticket.unread_count && ticket.unread_count > 0
//                                 ? 'text-red-500'
//                                 : 'text-[var(--main-color)]'
//                               }`}
//                             size={20}
//                           />
//                           {ticket.unread_count && ticket.unread_count > 0 && (
//                             <Mail size={12} className="absolute -top-1 -right-1 text-red-500" />
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2">
//                             <h3 className={`text-lg lg:text-xl font-semibold mb-0 font-[var(--font-morabba)] line-clamp-1 ${ticket.unread_count && ticket.unread_count > 0 ? 'text-gray-900' : 'text-gray-900'
//                               }`}>
//                               {ticket.subject || "بدون موضوع"}
//                             </h3>
//                             {ticket.unread_count && ticket.unread_count > 0 && (
//                               <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
//                                 جدید
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-gray-600 text-sm lg:text-base line-clamp-2 leading-relaxed">
//                             {ticket.message || "بدون متن"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm text-gray-500">
//                         <div className="flex items-center gap-1">
//                           <Clock size={14} />
//                           <span>{formatDate(ticket.created_at)}</span>
//                         </div>
//                         <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
//                           تیکت #{ticket.ticket_id}
//                         </span>
//                         {ticket.last_reply_at && (
//                           <span className="text-green-600 text-xs">
//                             آخرین پاسخ: {formatDate(ticket.last_reply_at)}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-3">
//                       <div className={`w-3 h-3 rounded-full lg:order-1 ${ticket.unread_count && ticket.unread_count > 0
//                           ? 'bg-red-500 animate-pulse'
//                           : 'bg-[var(--main-color)] animate-pulse'
//                         }`}></div>
//                       <span className={`text-xs px-2 py-1 rounded-full font-medium lg:order-2 ${getStatusColor(ticket.status)}`}>
//                         {getStatusText(ticket.status)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Create Ticket Modal */}
//         <CreateTicketModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onTicketCreated={handleTicketCreated}
//           userId={userId}
//         />
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Plus, MessageCircle, Clock, Search, Mail } from "lucide-react"
import { get } from "~/services/api"
import { useSnackbar } from "~/components/common/Snackbar"
import CreateTicketModal from "./CreateTicketModal"

interface Ticket {
  ticket_id: number
  user_id: number
  subject: string
  message: string
  created_at: string
  unread_count?: number // New field for unread messages
  last_reply_at?: string // When support team last replied
  status?: 'open' | 'pending' | 'closed' // Ticket status
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  // Get user ID from localStorage
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

  useEffect(() => {
    fetchTickets()
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchTickets, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      // Updated API call to include unread count
      const response = await get(`/dashboard/ticket/${userId}?include_unread=true`)

      let ticketData: Ticket[] = []

      if (Array.isArray(response.data)) {
        ticketData = response.data
      } else if (response.data && Array.isArray(response.data.tickets)) {
        ticketData = response.data.tickets
      } else if (response.data && typeof response.data === "object") {
        const possibleArrays = Object.values(response.data).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          ticketData = possibleArrays[0] as Ticket[]
        }
      }

      setTickets(ticketData)

      if (ticketData.length === 0) {
        console.log("No tickets found")
      }
    } catch (error) {
      showSnackbar("خطا در دریافت لیست تیکت‌ها", "error")
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      return dateString
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'open':
        return 'منتظر پاسخ'
      case 'pending':
        return 'پاسخ داده شده'
      case 'closed':
        return 'بسته شده'
      default:
        return 'فعال'
    }
  }

  const filteredTickets = Array.isArray(tickets)
    ? tickets.filter(
      (ticket) =>
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : []

  const handleTicketClick = async (ticketId: number) => {
    // Find the ticket in local state to check its status
    const currentTicket = tickets.find(t => t.ticket_id === ticketId)

    if (!currentTicket) {
      showSnackbar("تیکت یافت نشد", "error")
      return
    }

    // Check if ticket has been replied to (you can adjust this logic based on your data structure)
    const hasReplies = currentTicket.status === 'pending' || currentTicket.last_reply_at

    if (!hasReplies && currentTicket.status === 'open') {
      showSnackbar("تیکت شما هنوز پاسخ داده نشده است. لطفاً صبر کنید", "info")
      return
    }

    // Mark messages as read when clicking on ticket
    try {
      await get(`/dashboard/ticket/${ticketId}/mark-read`)
      // Update local state to remove unread count
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.ticket_id === ticketId
            ? { ...ticket, unread_count: 0 }
            : ticket
        )
      )
    } catch (error) {
      console.error("Error marking messages as read:", error)
      // Don't block navigation on this error
    }

    // Navigate to ticket detail
    try {
      navigate(`/dashboard/tickets/${ticketId}`)
    } catch (error) {
      console.error("Navigation error:", error)
      showSnackbar("تیکت شما هنوز پاسخ داده نشده است. لطفاً صبر کنید", "info")
    }
  }

  const handleTicketCreated = () => {
    fetchTickets()
  }

  // Calculate total unread messages
  const totalUnreadMessages = tickets.reduce((total, ticket) => total + (ticket.unread_count || 0), 0)

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
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-[var(--font-morabba)]">
                تیکت‌های پشتیبانی
              </h1>
              {totalUnreadMessages > 0 && (
                <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  {totalUnreadMessages} پیام جدید
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-2">مشاهده و مدیریت تیکت‌های خود ({tickets.length} تیکت)</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white cursor-pointer px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">تیکت جدید</span>
          </button>
        </div>

        {/* Search */}
        {Array.isArray(tickets) && tickets.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در تیکت‌ها..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Tickets List */}
        {!Array.isArray(tickets) || tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12 max-w-md mx-auto">
              <MessageCircle size={64} className="mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-600 mb-4 font-[var(--font-morabba)]">
                هیچ تیکتی وجود ندارد
              </h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                برای شروع، اولین تیکت خود را ایجاد کنید و با تیم پشتیبانی در ارتباط باشید
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-8 py-4 rounded-xl inline-flex items-center gap-3 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <Plus size={24} />
                ایجاد اولین تیکت
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:gap-6">
            {filteredTickets.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <Search size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">هیچ تیکتی با عبارت "{searchTerm}" یافت نشد</p>
                  <button onClick={() => setSearchTerm("")} className="mt-4 text-[var(--main-color)] hover:underline">
                    نمایش همه تیکت‌ها
                  </button>
                </div>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  onClick={() => handleTicketClick(ticket.ticket_id)}
                  className={`bg-white rounded-xl shadow-sm border transition-all duration-200 p-4 lg:p-6 cursor-pointer group relative ${(ticket.unread_count ?? 0) > 0
                      ? 'border-red-300 ring-2 ring-red-100 hover:shadow-xl'
                      : 'border-gray-200 hover:shadow-lg hover:border-[var(--main-color)]'
                    }`}
                >
                  {/* Unread indicator */}
                  {(ticket.unread_count ?? 0) > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {(ticket.unread_count ?? 0) > 9 ? '9+' : ticket.unread_count}
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <MessageCircle
                            className={`group-hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-1 ${(ticket.unread_count ?? 0) > 0
                                ? 'text-red-500'
                                : 'text-[var(--main-color)]'
                              }`}
                            size={20}
                          />
                          {(ticket.unread_count ?? 0) > 0 && (
                            <Mail size={12} className="absolute -top-1 -right-1 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`text-lg lg:text-xl font-semibold mb-0 font-[var(--font-morabba)] line-clamp-1 ${(ticket.unread_count ?? 0) > 0 ? 'text-gray-900' : 'text-gray-900'
                              }`}>
                              {ticket.subject || "بدون موضوع"}
                            </h3>
                            {(ticket.unread_count ?? 0) > 0 && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                جدید
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm lg:text-base line-clamp-2 leading-relaxed">
                            {ticket.message || "بدون متن"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatDate(ticket.created_at)}</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          تیکت #{ticket.ticket_id}
                        </span>
                        {ticket.last_reply_at && (
                          <span className="text-green-600 text-xs">
                            آخرین پاسخ: {formatDate(ticket.last_reply_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:gap-3">
                      <div className={`w-3 h-3 rounded-full lg:order-1 ${(ticket.unread_count ?? 0) > 0
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-[var(--main-color)] animate-pulse'
                        }`}></div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium lg:order-2 ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTicketCreated={handleTicketCreated}
          userId={userId}
        />
      </div>
    </div>
  )
}