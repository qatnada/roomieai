/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    AGENT_SERVER_URL: process.env.AGENT_SERVER_URL,
    NEXT_PUBLIC_DEMO_HOUSEHOLD_ID: process.env.NEXT_PUBLIC_DEMO_HOUSEHOLD_ID,
  },
}

module.exports = nextConfig