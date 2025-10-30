# 7th Reports Server

A comprehensive REST API server for managing educational reports, cognitive assessments, and learning materials.

## Features

- **User Management**: Students, teachers, and administrators
- **Subject Management**: Academic subjects with teacher assignments
- **Slide Management**: Learning materials organized by subjects
- **Cognitive Assessments**: Track student responses and confidence levels
- **Report Generation**: Comprehensive reports based on cognitive data
- **MongoDB Integration**: Robust data persistence
- **TypeScript**: Full type safety and better development experience

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 7th-reports-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file
MONGODB_URI=mongodb://localhost:27017/7th-reports
PORT=3000
API_SECRET_KEY=your-secret-key-here
FIRST_TOPIC_SLIDE_LIMIT=15
OTHER_TOPICS_SLIDE_LIMIT=4
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm build
npm start
```

## Authentication

All API endpoints require authentication using a secret API key. You can provide the key in one of two ways:

### Option 1: X-API-Key Header
```bash
curl -H "X-API-Key: your-secret-key-here" http://localhost:3000/api/users
```

### Option 2: Authorization Header (Bearer Token)
```bash
curl -H "Authorization: Bearer your-secret-key-here" http://localhost:3000/api/users
```

### In Postman
- Add header: `X-API-Key` with value `your-secret-key-here`
- Or add header: `Authorization` with value `Bearer your-secret-key-here`

### In React/Frontend
```javascript
const response = await fetch('/api/users', {
  headers: {
    'X-API-Key': 'your-secret-key-here',
    'Content-Type': 'application/json'
  }
});
```

**Important**: Change the default secret key in your `.env` file to a secure random string in production.

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /` - Server welcome message and API overview
- `GET /health` - Server health status

### Protected Endpoints (Authentication Required)
All endpoints under `/api/*` require authentication using the API key.

### Base URL
```
http://localhost:3000/api
```

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

**User Model:**
```typescript
{
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Topics (`/topics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/topics` | Get all active topics |
| GET | `/topics/:id` | Get topic by ID |
| GET | `/topics/report/:reportId` | Get topics by report |
| POST | `/topics` | Create new topic |
| PUT | `/topics/:id` | Update topic |
| DELETE | `/topics/:id` | Delete topic |

**Topic Model:**
```typescript
{
  name: string;
  inReport: ObjectId;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Slides (`/slides`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/slides` | Get all active slides |
| GET | `/slides/:id` | Get slide by ID |
| GET | `/slides/topic/:topicId` | Get slides by topic |
| POST | `/slides` | Create new slide |
| PUT | `/slides/:id` | Update slide |
| DELETE | `/slides/:id` | Deactivate slide |

**Slide Model:**
```typescript
{
  content: any; // Flexible content object
  inTopic: ObjectId;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cognitive Answers (`/cognitive-answers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cognitive-answers` | Get all cognitive answers |
| GET | `/cognitive-answers/:id` | Get cognitive answer by ID |
| GET | `/cognitive-answers/user/:userId` | Get answers by user |
| GET | `/cognitive-answers/subject/:subjectId` | Get answers by subject |
| GET | `/cognitive-answers/slide/:slideId` | Get answers by slide |
| POST | `/cognitive-answers` | Create new cognitive answer |
| PUT | `/cognitive-answers/:id` | Update cognitive answer |
| DELETE | `/cognitive-answers/:id` | Delete cognitive answer |

**Cognitive Answer Model:**
```typescript
{
  userId: ObjectId;
  subjectId: ObjectId;
  slideId: ObjectId;
  question: string;
  answer: string;
  confidence: number; // 1-5 scale
  timeSpent: number; // in seconds
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reports (`/reports`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports` | Get all active reports |
| GET | `/reports/:id` | Get report by ID |
| GET | `/reports/user/:userId` | Get reports by user |
| GET | `/reports/subject/:subjectId` | Get reports by subject |
| POST | `/reports` | Create new report |
| POST | `/reports/generate` | Generate report from cognitive answers |
| PUT | `/reports/:id` | Update report |
| DELETE | `/reports/:id` | Deactivate report |

**Report Model:**
```typescript
{
  userId: ObjectId;
  subjectId: ObjectId;
  title: string;
  description?: string;
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    averageConfidence: number;
    totalTimeSpent: number;
    accuracy: number;
  };
  cognitiveAnswers: ObjectId[];
  generatedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "count": 1
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message"
}
```

## Database Schema

The application uses MongoDB with the following collections:

1. **users** - User accounts and roles
2. **topics** - Academic topics and courses
3. **slides** - Learning materials and presentations
4. **cognitiveanswers** - Student assessment responses
5. **reports** - Generated reports and analytics

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

### Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration
├── models/
│   ├── User.ts             # User model
│   ├── Topic.ts            # Topic model
│   ├── Slide.ts            # Slide model
│   ├── CognitiveAnswers.ts # Cognitive answers model
│   └── Report.ts           # Report model
├── routes/
│   ├── users.ts            # User routes
│   ├── topics.ts           # Topic routes
│   ├── slides.ts           # Slide routes
│   ├── cognitive-answers.ts # Cognitive answers routes
│   └── reports.ts          # Report routes
└── server.ts               # Main server file
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/7th-reports` | MongoDB connection string |
| `API_SECRET_KEY` | `your-secret-key-here` | Secret key for API authentication |
| `FIRST_TOPIC_SLIDE_LIMIT` | `15` | Number of slides to fetch for the first topic |
| `OTHER_TOPICS_SLIDE_LIMIT` | `4` | Number of slides to fetch for all other topics |

## API Examples

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }'
```

### Create a Topic
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mathematics",
    "inReport": "report_id_here"
  }'
```

### Generate a Report
```bash
curl -X POST http://localhost:3000/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "topicId": "topic_id_here",
    "title": "Math Assessment Report",
    "description": "Comprehensive report for mathematics assessment",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 