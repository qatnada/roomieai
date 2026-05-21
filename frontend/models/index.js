// models/index.js
import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

// Household schema
const householdSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  rentDueDay: { type: Number, required: true, min: 1, max: 31 },
  landlordName: { type: String, required: true },
  landlordEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// Roommate schema
const roommateSchema = new Schema({
  householdId: { type: Schema.Types.ObjectId, ref: 'Household', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: '👤' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

// Payment sub-schema for expenses
const paymentSchema = new Schema({
  roommateId: { type: Schema.Types.ObjectId, ref: 'Roommate', required: true },
  name: { type: String, required: true }, // denormalized for easier querying
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date }
}, { _id: false })

// Expense schema
const expenseSchema = new Schema({
  householdId: { type: Schema.Types.ObjectId, ref: 'Household', required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['rent', 'utilities', 'groceries', 'supplies', 'other'],
    default: 'other'
  },
  paidByName: { type: String, required: true }, // denormalized
  payments: [paymentSchema],
  date: { type: Date, default: Date.now }
})

// Chore schema
const choreSchema = new Schema({
  householdId: { type: Schema.Types.ObjectId, ref: 'Household', required: true },
  title: { type: String, required: true },
  assigneeName: { type: String, required: true }, // denormalized
  assigneeId: { type: Schema.Types.ObjectId, ref: 'Roommate', required: true },
  dueDate: { type: Date, required: true },
  recurring: {
    type: String,
    enum: ['none', 'weekly', 'biweekly', 'monthly'],
    default: 'none'
  },
  status: {
    type: String,
    enum: ['pending', 'done', 'overdue'],
    default: 'pending'
  },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

// Maintenance issue schema
const maintenanceIssueSchema = new Schema({
  householdId: { type: Schema.Types.ObjectId, ref: 'Household', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['open', 'contacted_landlord', 'in_progress', 'fixed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reportedByName: { type: String, required: true }, // denormalized
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

// Landlord message schema
const landlordMessageSchema = new Schema({
  householdId: { type: Schema.Types.ObjectId, ref: 'Household', required: true },
  maintenanceId: { type: Schema.Types.ObjectId, ref: 'MaintenanceIssue' },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  tone: {
    type: String,
    enum: ['polite', 'firm', 'urgent'],
    default: 'polite'
  },
  isFollowUp: { type: Boolean, default: false },
  occurrenceCount: { type: Number, default: 1 },
  sent: { type: Boolean, default: false },
  sentAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

// Create or use existing models
export const Household = models.Household || model('Household', householdSchema)
export const Roommate = models.Roommate || model('Roommate', roommateSchema)
export const Expense = models.Expense || model('Expense', expenseSchema)
export const Chore = models.Chore || model('Chore', choreSchema)
export const MaintenanceIssue = models.MaintenanceIssue || model('MaintenanceIssue', maintenanceIssueSchema)
export const LandlordMessage = models.LandlordMessage || model('LandlordMessage', landlordMessageSchema)