# RoomieAI - Hackathon Build

🏠 **AI shared-living agent for students and roommates** - helps manage expenses, chores, maintenance issues, and landlord communication.

Built for **Gemini Agent Hackathon** using:
- **Google ADK (Python)** via Agent Starter Pack scaffolding
- **MongoDB MCP Server** for partner track integration
- **MongoDB Atlas** for all persistent data
- **Next.js** frontend with dark green command-center design
- **Cloud Run** deployment for scalability

## 🎯 Quick Demo

**The killer demo sentence:**
> "The AC is leaking again and the WiFi bill still hasn't been paid."

Watch the agent:
1. 🔍 Search historical maintenance issues → finds prior AC issue from 6 weeks ago
2. 📝 Log new AC issue → saves to MongoDB
3. ✉️ Draft firm landlord follow-up (not polite first notice!) → creates message
4. 💰 Check WiFi expense → finds $40 unpaid between Jordan and Sam
5. 📲 Generate payment reminder → friendly group chat message

## 🛠️ Setup

### Prerequisites
- **Node.js 18+** and **Python 3.10+**
- **MongoDB Atlas** free M0 cluster
- **Google Cloud** project with Vertex AI enabled
- **uv** Python package manager: `curl -LsSf https://astral.sh/uv/install.sh | sh`

### 1. MongoDB Atlas Setup
1. Create free cluster at https://cloud.mongodb.com
2. Database name: `roomieai`
3. Database user: `roomieai` with password
4. Network Access: allow `0.0.0.0/0` (for demo)
5. Connection string: `mongodb+srv://roomieai:<password>@roomieai-cluster.xxxxx.mongodb.net/roomieai`

### 2. Google Cloud Setup
```bash
# Enable APIs
gcloud services enable aiplatform.googleapis.com run.googleapis.com

# Authenticate
gcloud auth application-default login
```

### 3. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Agent:**
```bash
cd roomieai
pip install uv
uv sync
```

### 4. Environment Configuration

**Frontend `.env.local`:**
```
MONGODB_URI=mongodb+srv://roomieai:<password>@roomieai-cluster.xxxxx.mongodb.net/roomieai
AGENT_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_HOUSEHOLD_ID=will_be_set_after_seed
```

**Agent `roomieai/app/.env`:**
```
MONGODB_URI=mongodb+srv://roomieai:<password>@roomieai-cluster.xxxxx.mongodb.net/roomieai
ATLAS_CLIENT_ID=your_atlas_service_account_client_id
ATLAS_CLIENT_SECRET=your_atlas_service_account_secret
HOUSEHOLD_ID=will_be_set_after_seed
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

### 5. Seed Database

**CRITICAL:** The demo requires historical data, especially the old AC issue.

```bash
cd frontend
node seed.js
```

Copy the printed `householdId` to your `.env` files.

### 6. Run Development

**Terminal 1 - Agent Server:**
```bash
cd roomieai
make dev
# → Agent API at http://localhost:8000
# → ADK Playground at http://localhost:8001 (great for demo!)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# → Frontend at http://localhost:3000
```

## 📹 Demo Script (3 minutes)

### Before Recording
- [ ] Both localhost:3000 and localhost:8001 loaded
- [ ] MongoDB Atlas tab open showing `maintenance_issues` collection
- [ ] Screen recorded at 1920×1080

### Script

**[0:00-0:20] Hook**
> "This is RoomieAI — an AI agent that helps student roommates manage their shared home. Let me show you what makes this different from a chatbot."

**[0:20-0:40] Dashboard Tour**
> "Real data from MongoDB Atlas — rent due on the 1st, $35 owed by two roommates, one open maintenance issue, one overdue chore. All live."

**[0:40-2:00] THE KILLER DEMO**
Type: *"The AC is leaking again and the WiFi bill still hasn't been paid."*

Walk through each step:
- *"First it searches MongoDB maintenance history... found one from 6 weeks ago."*
- *"Now it logs a new issue — watch Atlas..."* (refresh MongoDB, show new document)
- *"Because it found prior history, it drafts a firm follow-up — not a polite first notice."*
- *"Now it checks the WiFi expense... Jordan and Sam each owe $20."*

**[2:00-2:20] Show Outputs**
Navigate to Messages tab → show the drafted firm follow-up with "Follow-up" badge

**[2:20-2:35] MongoDB Partner Callout**
> "Every database operation goes through the official MongoDB MCP server. The agent reasons about what to ask, then MongoDB MCP executes it."

**[2:35-2:50] Tab Sweep**
Quick tour of Expenses, Chores, Messages, and Customize button

**[2:50-3:00] Close**
> "RoomieAI. Gemini on Google's Agent Platform. MongoDB Atlas as the memory. MCP as the bridge."

## 🚀 Deployment

### Agent → Cloud Run
```bash
cd roomieai
make deploy
```

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```

## 🎯 Tech Stack Details

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Agent** | Google ADK (Python) | LLM reasoning + tool orchestration |
| **Database** | MongoDB Atlas | All persistent data |
| **Bridge** | MongoDB MCP Server | Agent ↔ Database communication |
| **Frontend** | Next.js 14 | 6-tab dashboard + chat interface |
| **Deployment** | Cloud Run + Vercel | Scalable hosting |
| **Model** | Gemini 2.5/3 Pro | Latest Google LLM |

## 📁 Project Structure

```
roomieai/
├── roomieai/          # Python ADK agent
│   ├── app/
│   │   ├── agent.py   # RoomieAI agent definition
│   │   └── main.py    # FastAPI backend
│   ├── Dockerfile
│   └── Makefile
└── frontend/          # Next.js application
    ├── app/           # Pages (Dashboard, Chat, etc.)
    ├── components/    # Reusable UI components
    ├── models/        # MongoDB schemas
    ├── seed.js        # Database seeding script
    └── package.json
```

## 🔍 MongoDB Collections

- **households** — Basic info + landlord contact
- **roommates** — Names, emails, avatars
- **expenses** — Bills with per-roommate payment tracking
- **chores** — Tasks with assignments and due dates
- **maintenance_issues** — Problems with status pipeline
- **landlord_messages** — AI-drafted communications

All collections include `householdId` for multi-tenancy and denormalized names for easier agent reasoning.

## 🎨 Design System

Dark green command-center aesthetic with:
- **Fonts:** Syne (display), DM Sans (body), DM Mono (code)
- **Colors:** Green accent (`#22c55e`) on dark surfaces
- **Animation:** Step-reveal for agent reasoning, thinking dots
- **Navigation:** Customizable tab visibility with localStorage persistence

## 🤝 Contributing

This is a hackathon build focused on demonstrating:
1. **Google ADK** agent scaffolding and deployment
2. **MongoDB MCP** integration for partner track
3. **Real-time reasoning** with historical context
4. **Production-ready** architecture on Google Cloud

---

**Built for Google Gemini Agent Hackathon** | **MongoDB Partner Track** | **Made with ❤️ for student roommates**