# FinFlow - Personal Finance Visualizer

A modern, comprehensive personal finance tracking application built with Next.js, React, and MongoDB.

## 🚀 Features

### Core Functionality
- **Transaction Management**: Add, edit, delete, and categorize transactions
- **Dashboard**: Overview of financial health with summary cards
- **Analytics**: Interactive charts and graphs for spending insights
- **AI Advisor**: Intelligent financial recommendations and advice
- **Budget Tracking**: Set and monitor category-based budgets

### Key Components
- **Responsive Design**: Mobile-first approach with clean, modern UI
- **Real-time Updates**: Live data synchronization
- **Category Management**: Predefined and custom categories
- **Export Functionality**: Download financial reports
- **Dark/Light Theme**: User preference support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MongoDB
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: OpenAI API integration

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finflow.git
cd finflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_nextauth_secret
```

5. Run the development server:
```bash
npm run dev
```

## 🎨 Design Philosophy

FinFlow uses a financial-themed color palette:
- **Primary**: Emerald/Green (growth, prosperity)
- **Secondary**: Blue (trust, stability)
- **Accent**: Gold/Yellow (wealth, success)
- **Background**: Clean whites and grays
- **Text**: Professional dark grays

## 📱 Pages Overview

### Dashboard
- Financial summary cards
- Recent transactions
- Budget overview
- Quick actions

### Transactions
- Transaction list with filtering
- Add/Edit transaction forms
- Category assignment
- Date range selection

### Analytics
- Monthly expense trends
- Category-wise breakdowns
- Budget vs actual comparisons
- Interactive charts

### AI Advisor
- Personalized financial advice
- Spending pattern analysis
- Budget recommendations
- Smart insights

## 🔧 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure
```
finflow/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable components
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript definitions
│   └── data/            # Static data
├── models/              # Database models
├── public/              # Static assets
└── ...config files
```

## 🤖 AI Integration

FinFlow integrates with OpenAI's API to provide:
- Personalized financial advice
- Spending pattern analysis
- Budget optimization suggestions
- Expense categorization assistance

## 📊 Analytics Features

- Monthly expense trends
- Category-wise spending analysis
- Budget vs actual comparisons
- Income vs expense tracking
- Savings rate calculation

## 🔒 Security

- Secure API endpoints
- Data validation and sanitization
- Environment variable protection


## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Recharts for the interactive charts
- OpenAI for the AI capabilities
- The Next.js team for the amazing framework