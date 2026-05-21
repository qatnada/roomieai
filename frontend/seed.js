// seed.js - Populate MongoDB Atlas with RoomieAI demo data
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local')
  process.exit(1)
}

console.log('🔌 Connecting to MongoDB Atlas...')

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB Atlas')

    const db = mongoose.connection.db

    // Clear existing data
    console.log('🧹 Clearing existing collections...')
    const collections = ['households', 'roommates', 'expenses', 'chores', 'maintenance_issues', 'landlord_messages']
    for (const collection of collections) {
      await db.collection(collection).deleteMany({})
    }

    // Create household
    console.log('🏠 Creating household...')
    const household = await db.collection('households').insertOne({
      name: 'Apt 4B Crew',
      address: '123 College Ave, Apt 4B',
      rentAmount: 1800,
      rentDueDay: 1,
      landlordName: 'Mr. Henderson',
      landlordEmail: 'henderson@properties.com',
      createdAt: new Date()
    })
    const householdId = household.insertedId
    console.log(`📍 Household created with ID: ${householdId}`)

    // Create roommates
    console.log('👥 Creating roommates...')
    const alex = (await db.collection('roommates').insertOne({
      householdId: householdId,
      name: 'Alex',
      avatar: '🧑',
      email: 'alex@uni.edu',
      isActive: true,
      createdAt: new Date()
    })).insertedId

    const jordan = (await db.collection('roommates').insertOne({
      householdId: householdId,
      name: 'Jordan',
      avatar: '👩',
      email: 'jordan@uni.edu',
      isActive: true,
      createdAt: new Date()
    })).insertedId

    const sam = (await db.collection('roommates').insertOne({
      householdId: householdId,
      name: 'Sam',
      avatar: '🧔',
      email: 'sam@uni.edu',
      isActive: true,
      createdAt: new Date()
    })).insertedId

    console.log('✅ Roommates created')

    // 🔑 THE CRITICAL SEED RECORD — old AC issue from 6 weeks ago
    // Without this, the agent can't show "it happened before"
    console.log('❄️ Creating historical AC issue (6 weeks ago)...')
    await db.collection('maintenance_issues').insertOne({
      householdId: householdId,
      title: 'AC leaking',
      description: 'AC unit dripping water near window — happened during heat wave',
      category: 'hvac',
      status: 'contacted_landlord',
      priority: 'high',
      reportedByName: 'Alex',
      createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000) // 6 weeks ago
    })

    // Create WiFi expense with unpaid amounts
    console.log('💰 Creating WiFi expense...')
    await db.collection('expenses').insertOne({
      householdId: householdId,
      description: 'WiFi bill',
      totalAmount: 60,
      category: 'utilities',
      paidByName: 'Alex',
      payments: [
        { roommateId: alex, name: 'Alex', amount: 20, paid: true, paidAt: new Date() },
        { roommateId: jordan, name: 'Jordan', amount: 20, paid: false },
        { roommateId: sam, name: 'Sam', amount: 20, paid: false }
      ],
      date: new Date()
    })

    // Create groceries expense
    console.log('🛒 Creating groceries expense...')
    await db.collection('expenses').insertOne({
      householdId: householdId,
      description: 'Groceries run',
      totalAmount: 45,
      category: 'groceries',
      paidByName: 'Jordan',
      payments: [
        { roommateId: alex, name: 'Alex', amount: 15, paid: true, paidAt: new Date() },
        { roommateId: jordan, name: 'Jordan', amount: 15, paid: true, paidAt: new Date() },
        { roommateId: sam, name: 'Sam', amount: 15, paid: false }
      ],
      date: new Date()
    })

    // Create overdue chore
    console.log('🗑️ Creating overdue chore...')
    await db.collection('chores').insertOne({
      householdId: householdId,
      title: 'Take out trash',
      assigneeName: 'Sam',
      assigneeId: sam,
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days overdue
      status: 'overdue',
      recurring: 'weekly',
      createdAt: new Date()
    })

    // Create pending chore
    console.log('🛁 Creating pending chore...')
    await db.collection('chores').insertOne({
      householdId: householdId,
      title: 'Clean bathroom',
      assigneeName: 'Jordan',
      assigneeId: jordan,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // due in 2 days
      status: 'pending',
      recurring: 'biweekly',
      createdAt: new Date()
    })

    console.log('\n✅ Seed complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Household ID: ${householdId.toString()}`)
    console.log('\n👉 Add to your .env.local file:')
    console.log(`NEXT_PUBLIC_DEMO_HOUSEHOLD_ID=${householdId.toString()}`)
    console.log('\n👉 Add to your agent .env file:')
    console.log(`HOUSEHOLD_ID=${householdId.toString()}`)
    console.log('\n🔥 Demo ready! The historical AC issue is key for the demo.')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

seedDatabase()