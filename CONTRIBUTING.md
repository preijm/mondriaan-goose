# Contributing to MilkMeNot

Thank you for your interest in contributing to MilkMeNot! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Be respectful and inclusive. We welcome contributions from everyone regardless of experience level, background, or identity.

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- A Supabase account (for backend development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/milkmenot/mondriaan-goose.git
   cd mondriaan-goose
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in `.env`

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Code Style

### General Guidelines

- Write clean, readable, and maintainable code
- Follow existing patterns in the codebase
- Keep components small and focused
- Use meaningful variable and function names

### TypeScript

- Use TypeScript for all new code
- Define proper types - avoid `any`
- Use interfaces for object shapes
- Export types from dedicated type files

```typescript
// ✅ Good
interface MilkTest {
  id: string;
  rating: number;
  notes: string | null;
}

// ❌ Avoid
const data: any = fetchData();
```

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use descriptive component names

```typescript
// ✅ Good - focused component
const RatingStars = ({ rating }: { rating: number }) => {
  return <div>{/* star rendering */}</div>;
};

// ❌ Avoid - component doing too much
const EverythingComponent = () => {
  // 500 lines of mixed concerns
};
```

### Styling

- Use Tailwind CSS utility classes
- Use semantic design tokens from `index.css`
- Never use direct colors - always use CSS variables
- Ensure responsive design with mobile-first approach

```typescript
// ✅ Good - using design tokens
<div className="bg-background text-foreground">

// ❌ Avoid - hardcoded colors
<div className="bg-white text-black">
```

### File Organization

```
src/
├── components/      # Reusable UI components
│   ├── ui/         # Base UI components (shadcn)
│   └── [feature]/  # Feature-specific components
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── contexts/       # React contexts
├── lib/            # Utility functions
├── types/          # TypeScript types
└── integrations/   # External service integrations
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-barcode-scanner`
- `fix/rating-display-bug`
- `docs/update-readme`
- `refactor/simplify-auth-flow`

### Commit Messages

Write clear, concise commit messages:

```bash
# ✅ Good
git commit -m "Add barcode scanner for product lookup"
git commit -m "Fix rating not displaying on mobile"
git commit -m "Refactor auth context for better performance"

# ❌ Avoid
git commit -m "fix stuff"
git commit -m "updates"
```

### Testing Your Changes

1. Ensure the app builds without errors:
   ```bash
   npm run build
   ```

2. Test your changes in the browser
3. Check for TypeScript errors
4. Verify mobile responsiveness

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-reviewed the code for obvious issues
- [ ] Added comments for complex logic
- [ ] Updated documentation if needed
- [ ] Tested on both desktop and mobile
- [ ] No TypeScript or build errors

### Creating a Pull Request

1. Push your branch to GitHub
2. Open a Pull Request against `main`
3. Fill out the PR template with:
   - Description of changes
   - Screenshots (for UI changes)
   - Related issue numbers

### PR Title Format

```
feat: Add barcode scanner feature
fix: Resolve rating display issue on mobile
docs: Update contributing guidelines
refactor: Simplify authentication flow
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case / problem it solves
- Possible implementation approach (optional)

## Questions?

- Open an issue for general questions
- Check existing issues before creating new ones
- Visit [milkmenot.com](https://milkmenot.com) to see the app in action

---

Thank you for contributing to MilkMeNot! 🥛
