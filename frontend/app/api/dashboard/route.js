// app/api/dashboard/route.js - Dashboard summary data
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Household, Expense, Chore, MaintenanceIssue } from '@/models'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')

    if (!householdId) {
      return NextResponse.json({ error: 'householdId is required' }, { status: 400 })
    }

    // Get household info for rent due date calculation
    const household = await Household.findById(householdId)
    if (!household) {
      return NextResponse.json({ error: 'Household not found' }, { status: 404 })
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
    const expenses = await Expense.find({ householdId })
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
    }).sort({ createdAt: -1 })

    const recentOverdueChore = await Chore.findOne({
      householdId,
      status: 'overdue'
    }).sort({ dueDate: 1 })

    const recentUnpaidExpense = await Expense.findOne({
      householdId,
      'payments.paid': false
    }).sort({ date: -1 })

    return NextResponse.json({
      rentDaysLeft: daysUntilRent,
      totalOwed,
      openIssues,
      overdueChores,
      recentActivity: {
        maintenance: recentMaintenance,
        overdueChore: recentOverdueChore,
        unpaidExpense: recentUnpaidExpense
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}