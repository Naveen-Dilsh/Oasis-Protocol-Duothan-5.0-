# The OASIS Protocol 🚀

> **Ready Player One inspired competitive programming platform where teams solve algorithmic challenges to unlock buildathon tasks and restore the virtual OASIS.**

## 🎮 Overview
A dual-phase hackathon platform built with Next.js that gamifies competitive programming. Teams must crack algorithmic puzzles to obtain flags, then submit those flags to unlock buildathon challenges in their quest to restore the OASIS.

## ✨ Key Features
- 🔐 **Secure Team Authentication** - JWT-based login with session management
- ⚡ **Live Code Execution** - Real-time compilation via Piston API
- 🏆 **Progressive Unlocking** - Solve algorithms → Get flags → Unlock buildathon
- 📊 **Dynamic Leaderboards** - Real-time team rankings and progress tracking
- 👨‍💼 **Admin Dashboard** - Complete challenge and team management system
- 🔗 **GitHub Integration** - Project submission and validation

## 🛠️ Tech Stack
- **Frontend**: Next.js, JavaScript, Tailwind CSS, ShadCN UI
- **Backend**: Prisma ORM, MySQL, JWT Authentication
- **APIs**: Piston API for code execution
- **Features**: RBAC, Session Management, File Uploads

## 🚀 Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/oasis-protocol.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

## 🎯 Core Functionality
1. **Team Registration** - Unique team signup with validation
2. **Algorithmic Challenges** - Code editor with multi-language support
3. **Flag Validation** - Submit correct outputs to progress
4. **Buildathon Unlock** - Access project-based challenges
5. **Admin Panel** - Manage challenges, teams, and submissions
6. **Leaderboard** - Track team progress and rankings

## 🌟 The Experience
Teams enter the darkened OASIS universe and must work through layers of security by solving coding challenges. Each correct solution provides a flag that unlocks the next phase, combining algorithmic thinking with practical development skills.

## 📝 Environment Setup
Create a `.env.local` file with:
```env
# Database
DATABASE_URL=" "

# JWT Secret
JWT_SECRET=" "

# Admin Credentials
ADMIN_EMAIL=" "
ADMIN_PASSWORD=" "

# Piston For Code Execution
PISTON_API_URL=" "
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

**Ready to enter the OASIS? The future of competitive programming awaits! 🎮**
