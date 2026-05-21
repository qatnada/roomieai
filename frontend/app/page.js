// app/page.js - Dashboard (Server-side rendered for reliable data fetching)
import connectDB from '@/lib/db'
import { Household, Expense, Chore, MaintenanceIssue } from '@/models'
import { Calendar, DollarSign, AlertTriangle, Clock, ArrowRight } from 'lucide-react'
import StatCard from '@/components/StatCard'
import Link from 'next/link'

async function getDashboardData() {
  try {
    await connectDB()

    // Use the environment variable for household ID
    const householdId = process.env.NEXT_PUBLIC_DEMO_HOUSEHOLD_ID

    if (!householdId) {
      throw new Error('No household ID configured')
    }

    // Get household info for rent due date calculation
    const household = await Household.findById(householdId).lean()
    if (!household) {
      throw new Error('Household not found')
    }

    // Calculate days until rent is due
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    let nextRentDate = new Date(currentYear, currentMonth, household.rentDueDay)

    if (nextRentDate <= today) {
      nextRentDate = new Date(currentYear, currentMonth + 1, household.rentDueDay)
    }

    const daysUntilRent = Math.ceil((nextRentDate - today) / (1000 * 60 * 60 * 24))

    // Calculate total owed from unpaid expenses
    const expenses = await Expense.find({ householdId }).lean()
    let totalOwed = 0

    expenses.forEach(expense => {
      expense.payments.forEach(payment => {
        if (!payment.paid) {
          totalOwed += payment.amount
        }
      })
    })

    // Count open maintenance issues
    const openIssues = await MaintenanceIssue.countDocuments({
      householdId,
      status: { $ne: 'fixed' }
    })

    // Count overdue chores
    const overdueChores = await Chore.countDocuments({
      householdId,
      status: 'overdue'
    })

    // Get recent activity
    const recentMaintenance = await MaintenanceIssue.findOne({
      householdId
    }).sort({ createdAt: -1 }).lean()

    const recentOverdueChore = await Chore.findOne({
      householdId,
      status: 'overdue'
    }).sort({ dueDate: 1 }).lean()

    const recentUnpaidExpense = await Expense.findOne({
      householdId,
      'payments.paid': false
    }).sort({ date: -1 }).lean()

    return {
      rentDaysLeft: daysUntilRent,
      totalOwed,
      openIssues,
      overdueChores,
      recentActivity: {
        maintenance: recentMaintenance,
        overdueChore: recentOverdueChore,
        unpaidExpense: recentUnpaidExpense
      }
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return null
  }
}

export default async function Dashboard() {
  const dashboardData = await getDashboardData()

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Dashboard Unavailable</h2>
        <p className="text-text-3 mb-4">Unable to fetch dashboard data</p>
        <p className="text-text-4 text-sm">
          Make sure MongoDB is running and the seed script has been executed.
        </p>
      </div>
    )
  }

  const { rentDaysLeft, totalOwed, openIssues, overdueChores, recentActivity } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome to <span className="text-accent">RoomieAI</span>
        </h1>
        <p className="text-text-3">
          Your intelligent shared living assistant for Apt 4B Crew
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Rent Due In"
          value={`${rentDaysLeft} days`}
          subtitle="1st of each month"
          icon={<Calendar />}
          color={rentDaysLeft <= 3 ? "red" : rentDaysLeft <= 7 ? "yellow" : "accent"}
        />
        <StatCard
          title="Total Owed"
          value={`$${totalOwed}`}
          subtitle="Unpaid expenses"
          icon={<DollarSign />}
          color={totalOwed > 50 ? "red" : totalOwed > 0 ? "yellow" : "green"}
        />
        <StatCard
          title="Open Issues"
          value={openIssues}
          subtitle="Maintenance needed"
          icon={<AlertTriangle />}
          color={openIssues > 2 ? "red" : openIssues > 0 ? "yellow" : "green"}
        />
        <StatCard
          title="Overdue Chores"
          value={overdueChores}
          subtitle="Need attention"
          icon={<Clock />}
          color={overdueChores > 1 ? "red" : overdueChores > 0 ? "yellow" : "green"}
        />
      </div>

      {/* Agent Chat - Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-display font-semibold mb-4">Ask RoomieAI</h2>
          <div className="h-[500px] border border-white/10 rounded-lg p-4 bg-surface-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-2 mb-2">🤖 RoomieAI Chat</p>
              <p className="text-text-3 text-sm">
                Chat functionality available - connect to agent endpoint to enable
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity?.maintenance && (
              <Link href="/maintenance" className="block">
                <div className="card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-accent transition-colors">
                        Latest Issue
                      </h4>
                      <p className="text-text-2 text-xs mt-1">
                        {recentActivity.maintenance?.title || 'No title'}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                        recentActivity.maintenance?.status === 'open' ? 'status-open' :
                        recentActivity.maintenance?.status === 'contacted_landlord' ? 'status-contacted' :
                        recentActivity.maintenance?.status === 'in_progress' ? 'status-in-progress' :
                        'status-fixed'
                      }`}>
                        {recentActivity.maintenance?.status?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-text-4 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </Link>
            )}

            {recentActivity?.overdueChore && (
              <Link href="/chores" className="block">
                <div className="card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-accent transition-colors">
                        Overdue Chore
                      </h4>
                      <p className="text-text-2 text-xs mt-1">
                        {recentActivity.overdueChore?.title || 'No title'}
                      </p>
                      <p className="text-red-400 text-xs mt-1">
                        Assigned to {recentActivity.overdueChore?.assigneeName || 'Unknown'}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-text-4 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </Link>
            )}

            {recentActivity?.unpaidExpense && (
              <Link href="/expenses" className="block">
                <div className="card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-accent transition-colors">
                        Unpaid Expense
                      </h4>
                      <p className="text-text-2 text-xs mt-1">
                        {recentActivity.unpaidExpense?.description || 'No description'}
                      </p>
                      <p className="text-yellow-400 text-xs mt-1">
                        ${(recentActivity.unpaidExpense?.payments || [])
                          .filter(p => !p.paid)
                          .reduce((sum, p) => sum + (p.amount || 0), 0)} pending
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-text-4 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </Link>
            )}

            {(!recentActivity?.maintenance && !recentActivity?.overdueChore && !recentActivity?.unpaidExpense) && (
              <div className="card text-center py-8">
                <p className="text-text-3">All caught up! 🎉</p>
                <p className="text-text-4 text-sm mt-1">No recent activity to show</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}