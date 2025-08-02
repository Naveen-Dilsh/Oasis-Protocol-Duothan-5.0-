const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "OasisMaster2045", 12)

  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@oasis.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@oasis.com",
      password: hashedPassword,
      name: "OASIS Administrator",
    },
  })

  console.log("✅ Admin user created:", admin.email)

//   // Create sample challenges
//   const challenges = [
//     {
//       title: "The First Key",
//       description:
//         "Unlock the first layer of the OASIS security system. This challenge tests your ability to decode encrypted messages and understand the fundamental structure of the virtual world.",
//       points: 500,
//       order: 1,
//       algorithmicProblem: {
//         title: "Array Sum Challenge",
//         description:
//           "Given an array of integers, find the sum of all elements and return it as a string with the prefix 'SUM_'.",
//         inputFormat: "First line contains n (array size). Second line contains n space-separated integers.",
//         outputFormat: "Single line containing 'SUM_' followed by the sum",
//         constraints: "1 ≤ n ≤ 1000, -1000 ≤ array elements ≤ 1000",
//         examples: [
//           {
//             input: "3\n1 2 3",
//             output: "SUM_6",
//           },
//           {
//             input: "4\n-1 0 1 2",
//             output: "SUM_2",
//           },
//         ],
//         flag: "SUM_6",
//       },
//       buildathonProblem: {
//         title: "Task Management Dashboard",
//         description: "Build a responsive task management dashboard with user authentication and real-time updates.",
//         requirements: `
// 1. User authentication system (login/register)
// 2. Create, read, update, delete tasks
// 3. Task categories and priorities
// 4. Responsive design for mobile and desktop
// 5. Search and filter functionality
// 6. Data persistence (database or local storage)
// 7. Clean, modern UI/UX design
//         `,
//         resources: [
//           "https://react.dev",
//           "https://nextjs.org/docs",
//           "https://tailwindcss.com/docs",
//           "https://ui.shadcn.com",
//         ],
//       },
//     },
//     {
//       title: "The Second Gate",
//       description: "Navigate through the second security layer by solving complex algorithmic puzzles.",
//       points: 750,
//       order: 2,
//       algorithmicProblem: {
//         title: "String Reversal Cipher",
//         description:
//           "Reverse each word in a sentence while keeping the word order intact. Return the result with 'REVERSED_' prefix.",
//         inputFormat: "Single line containing a sentence with words separated by spaces.",
//         outputFormat: "Single line containing 'REVERSED_' followed by the processed sentence",
//         constraints: "1 ≤ sentence length ≤ 1000 characters",
//         examples: [
//           {
//             input: "hello world",
//             output: "REVERSED_olleh dlrow",
//           },
//           {
//             input: "the quick brown fox",
//             output: "REVERSED_eht kciuq nworb xof",
//           },
//         ],
//         flag: "REVERSED_olleh dlrow",
//       },
//       buildathonProblem: {
//         title: "E-commerce Product Catalog",
//         description: "Create a modern e-commerce product catalog with shopping cart functionality.",
//         requirements: `
// 1. Product listing with search and filters
// 2. Product detail pages with images
// 3. Shopping cart with add/remove items
// 4. User authentication and profiles
// 5. Responsive design
// 6. Product categories and sorting
// 7. Checkout process simulation
//         `,
//         resources: [
//           "https://stripe.com/docs",
//           "https://nextjs.org/docs/app/building-your-application/data-fetching",
//           "https://www.prisma.io/docs",
//         ],
//       },
//     },
//   ]

//   for (const challengeData of challenges) {
//     const challenge = await prisma.challenge.create({
//       data: {
//         title: challengeData.title,
//         description: challengeData.description,
//         points: challengeData.points,
//         order: challengeData.order,
//         algorithmicProblem: {
//           create: challengeData.algorithmicProblem,
//         },
//         buildathonProblem: {
//           create: challengeData.buildathonProblem,
//         },
//       },
//     })
//     console.log("✅ Challenge created:", challenge.title)
//   }

//   // Create sample teams for testing
//   const teams = [
//     {
//       name: "Code Warriors",
//       email: "warriors@oasis.com",
//       password: await bcrypt.hash("password123", 12),
//       members: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
//       totalPoints: 500,
//     },
//     {
//       name: "Digital Rebels",
//       email: "rebels@oasis.com",
//       password: await bcrypt.hash("password123", 12),
//       members: ["Diana Prince", "Ethan Hunt", "Fiona Shaw"],
//       totalPoints: 750,
//     },
//     {
//       name: "Cyber Guardians",
//       email: "guardians@oasis.com",
//       password: await bcrypt.hash("password123", 12),
//       members: ["Grace Hopper", "Alan Turing", "Ada Lovelace"],
//       totalPoints: 1250,
//     },
//   ]

//   for (const teamData of teams) {
//     const team = await prisma.team.create({
//       data: teamData,
//     })
//     console.log("✅ Sample team created:", team.name)
//   }

//   console.log("🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
