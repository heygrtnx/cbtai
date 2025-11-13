# AI CBT Platform - Nigerian Schools

A comprehensive Computer-Based Testing (CBT) platform designed specifically for Nigerian schools, featuring AI-powered question generation, automated grading, and multi-channel notifications.

## Features

### 🏫 School Management
- School registration with license fee payment
- Multi-campus support
- Payment integration (Paystack, Flutterwave, Bank Transfer)
- Annual renewal system

### 👨‍🏫 Teacher Features
- Teacher onboarding and management
- AI-powered question generation from lesson notes/textbooks
- Exam creation (CA, Test, Examination, Mock Exam, Quiz)
- Question bank management
- Result management and grading
- Report card generation

### 👨‍🎓 Student Features
- Bulk student import via CSV
- Unique access code generation
- Exam taking with offline support
- Real-time results (configurable)
- Performance tracking

### 📊 Exam System
- Multiple question types (Multiple Choice, Theory)
- Image-based questions
- Question and option randomization
- Exam security features
- Time management
- Make-up exam support

### 📱 Notifications
- SMS notifications (Termii/SendChamp)
- WhatsApp notifications
- Email notifications
- In-app notifications

### 📈 Analytics & Reporting
- School-level analytics
- Teacher performance metrics
- Student performance tracking
- Class comparisons
- Nigerian grading system (A-F)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Paystack, Flutterwave
- **UI**: HeroUI, Tailwind CSS
- **Forms**: React Hook Form, Zod
- **Notifications**: Termii, WhatsApp Business API

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Paystack/Flutterwave account (for payments)
- Termii account (for SMS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cbt
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random secret for NextAuth
   - `PAYSTACK_SECRET_KEY`: Your Paystack secret key
   - `FLUTTERWAVE_SECRET_KEY`: Your Flutterwave secret key
   - `TERMII_API_KEY`: Your Termii API key
   - Other service keys as needed

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   
   # Or run migrations
   pnpm db:migrate
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cbt/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── schools/       # School management
│   │   ├── payments/      # Payment processing
│   │   ├── students/      # Student management
│   │   ├── exams/         # Exam management
│   │   └── results/       # Results and grading
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── reusables/        # Reusable components
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   └── utils/            # Utility functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript types
```

## Key Features Implementation

### School Registration Flow
1. School fills registration form
2. System calculates license fee (NGN 300,000 + NGN 3,000 per student)
3. Payment via Paystack/Flutterwave
4. School activated upon payment verification

### Student Onboarding
1. Upload CSV with student data
2. System generates unique access codes
3. Access codes distributed via SMS/WhatsApp/Email
4. Students activate accounts with access codes

### Exam Creation
1. Teacher uploads lesson notes/textbook
2. AI generates questions based on content
3. Teacher reviews and edits questions
4. Exam configured (timing, security, etc.)
5. Exam assigned to classes/students

### Exam Taking
1. Student logs in with access code
2. Starts exam within time window
3. Answers auto-saved
4. Offline support for poor connectivity
5. Results displayed (immediate or after review)

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler (login, logout, session)

### Schools
- `POST /api/schools/register` - Register a new school
- `GET /api/schools/[id]` - Get school details
- `PUT /api/schools/[id]` - Update school information

### Payments
- `POST /api/payments/initialize` - Initialize payment (Paystack/Flutterwave)
- `POST /api/payments/verify` - Verify payment status
- `GET /api/payments/[id]` - Get payment details
- `POST /api/payments/renew` - Process annual renewal

### Students
- `POST /api/students/upload` - Upload students via CSV
- `GET /api/students` - List students (with filters)
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/[id]` - Update student information
- `POST /api/students/[id]/regenerate-access-code` - Regenerate access code

### Teachers
- `POST /api/teachers` - Create teacher account
- `GET /api/teachers` - List teachers
- `GET /api/teachers/[id]` - Get teacher details
- `PUT /api/teachers/[id]` - Update teacher information

### Exams
- `POST /api/exams/create` - Create a new exam
- `GET /api/exams` - List exams (with filters)
- `GET /api/exams/[id]` - Get exam details
- `PUT /api/exams/[id]` - Update exam
- `POST /api/exams/[id]/publish` - Publish exam
- `POST /api/exams/[id]/attempt` - Start exam attempt
- `POST /api/exams/attempts/[attemptId]/submit` - Submit exam
- `GET /api/exams/[id]/results` - Get exam results

### Results
- `GET /api/results` - List results (with filters)
- `GET /api/results/[id]` - Get result details
- `PUT /api/results/[id]` - Update result (teacher grading)
- `POST /api/results/[id]/release` - Release results to students

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:
- `School` - School information
- `User` - User accounts (admin, teacher, student, parent)
- `Teacher` - Teacher profiles
- `Student` - Student profiles
- `Exam` - Exam definitions
- `Question` - Exam questions
- `ExamAttempt` - Student exam attempts
- `Answer` - Student answers
- `Result` - Exam results
- `Payment` - Payment records

## Environment Variables

All environment variables are documented in `.env.example`. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables

**Database:**
- `DATABASE_URL` - PostgreSQL connection string

**Authentication:**
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)

**Application:**
- `NEXT_PUBLIC_APP_URL` - Public URL of your application

**Payment Gateways (at least one required):**
- `PAYSTACK_SECRET_KEY` - Paystack secret key
- `PAYSTACK_PUBLIC_KEY` - Paystack public key (for frontend)
- `FLUTTERWAVE_SECRET_KEY` - Flutterwave secret key

**Notifications:**
- `TERMII_API_KEY` - Termii API key for SMS
- `TERMII_SENDER_ID` - Sender ID for SMS
- Email service configuration (SMTP, SendGrid, or Mailgun)
- WhatsApp Business API (optional)

**AI Services (optional but recommended):**
- `OPENAI_API_KEY` - OpenAI API key for question generation and grading

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema changes to database (dev)
pnpm db:migrate       # Create and run migrations (production)
pnpm db:studio        # Open Prisma Studio (database GUI)
```

### Development Workflow

1. **Start the database**
   ```bash
   # Using Docker (recommended)
   docker run --name cbt-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=cbt_platform -p 5432:5432 -d postgres
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Prisma Studio: Run `pnpm db:studio` and open http://localhost:5555

### Testing the API

You can test the API endpoints using tools like:
- **Postman** - Import the API collection
- **Thunder Client** (VS Code extension)
- **curl** - Command line tool
- **Insomnia** - API testing tool

Example API test:
```bash
# Register a school
curl -X POST http://localhost:3000/api/schools/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "email": "test@school.com",
    "phone": "+2341234567890",
    ...
  }'
```

## Deployment

### Prerequisites for Production

1. **Database**: Set up a managed PostgreSQL database (Railway, Supabase, etc.)
2. **Environment Variables**: Configure all required variables in your hosting platform
3. **File Storage**: Set up Backblaze B2 or Cloudinary for file uploads
4. **Domain**: Configure your domain and SSL certificate

### Deployment Steps

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Run migrations**
   ```bash
   pnpm db:migrate
   ```

3. **Deploy to your platform** (Vercel, Railway, etc.)

### Recommended Hosting Platforms

- **Vercel** - Easiest for Next.js (recommended)
- **Railway** - Good for full-stack apps with database
- **DigitalOcean** - Cost-effective option

## Troubleshooting

### Common Issues

**Database Connection Error**
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Verify network/firewall settings

**Payment Gateway Errors**
- Verify API keys are correct
- Check if using test/live keys appropriately
- Ensure webhook URLs are configured

**Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your app URL
- Clear browser cookies and try again

**File Upload Errors**
- Check file size limits
- Verify storage configuration (local/Backblaze B2/Cloudinary)
- Ensure upload directory has write permissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Never commit `.env` files
- Use strong passwords and API keys
- Enable HTTPS in production
- Regularly update dependencies
- Follow security best practices for handling student data (NDPR compliance)

## License

Private - All rights reserved

## Support

For support, email support@cbtplatform.com or create an issue in the repository.

## Acknowledgments

- Built for Nigerian educational institutions
- Designed with mobile-first approach for low-bandwidth environments
- Compliant with NDPR (Nigeria Data Protection Regulation)
