# Learning Platform Frontend

## Overview
This is the frontend of a learning platform, built with Next.js, TypeScript, and Tailwind CSS. The project includes login and registration pages with a modern and responsive user interface.

## Features
- **Login page** with email field, password, remember login option, and forgot password link
- **Registration page** with role selection (student/teacher) and necessary information fields
- Fully responsive design (mobile-first)
- Beautiful transition effects thanks to Tailwind CSS
- Complete TypeScript code for data type safety

## Project Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── components/
│   │   └── auth/
│   │       ├── AuthLayout.tsx
│   │       ├── LoginForm.tsx
│   │       └── SignUpForm.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
cd frontend
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Brand Colors
- White: #FFFFFF
- Navy Blue: #152C61 (Primary)
- Dark Red: #AC292D (Secondary)

## Implementation Details
- Uses Next.js App Router
- Tailwind CSS for styling
- TypeScript for type safety
- Reusable components (AuthLayout, LoginForm, SignUpForm)