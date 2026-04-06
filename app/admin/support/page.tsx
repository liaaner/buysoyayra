import { getAdminTickets } from './actions'
import AdminSupportDashboard from './AdminSupportDashboard'

export default async function AdminSupportPage() {
  const initialTickets = await getAdminTickets()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Support Desk</h2>
      </div>
      <AdminSupportDashboard initialTickets={initialTickets} />
    </div>
  )
}