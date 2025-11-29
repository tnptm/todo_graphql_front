This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Todo App with GraphQL — Documentation

### Overview
A full-stack Todo application using Next.js (App Router) with Apollo Client for GraphQL and a Django backend. Supports creating, reading, updating, and deleting todos, plus filtering and optimistic UI updates.

### Tech Stack
- Next.js (App Router, TypeScript)
- Apollo Client (GraphQL)
- Django backend (e.g., Django + Strawberry GraphQL or Graphene; Django REST for auth)
- Styling: Tailwind CSS or CSS Modules
- State: Apollo Cache


### Prerequisites
- Node.js 18+
- A running Django server exposing the Todo GraphQL schema
- Package manager: npm, yarn, pnpm, or bun
- Python 3.10+ and Django installed for the backend

### Environment Variables
Create `.env.local`:
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api.example.com/graphql`
- Optional auth:
    - `NEXT_PUBLIC_GRAPHQL_AUTH_HEADER=Authorization`
    - `NEXT_PUBLIC_GRAPHQL_TOKEN=Bearer <token>`

### GraphQL Schema (example)
- Types:
    - `type Todo { id: ID!; title: String!; completed: Boolean!; createdAt: String!; updatedAt: String }`
- Queries:
    - `todos(filter: { completed: Boolean }): [Todo!]!`
    - `todo(id: ID!): Todo`
- Mutations:
    - `createTodo(title: String!): Todo!`
    - `updateTodo(id: ID!, title: String, completed: Boolean): Todo!`
    - `deleteTodo(id: ID!): Boolean!`
- Subscriptions (optional):
    - `todoUpdated: Todo`
    - `todoCreated: Todo`
    - `todoDeleted: ID`

### Client Setup (Apollo)
- Create `lib/apollo.ts`:
    - Initialize `ApolloClient` with `HttpLink` pointing to `NEXT_PUBLIC_GRAPHQL_ENDPOINT`
    - Include auth header if configured
    - Use `InMemoryCache` with type policies for `Todo`
- Wrap `app/layout.tsx` with `ApolloProvider`

### Queries and Mutations
- Queries:
    - `GET_TODOS` with optional `filter.completed`
- Mutations:
    - `CREATE_TODO(title)`
    - `UPDATE_TODO(id, title, completed)`
    - `DELETE_TODO(id)`
- Optimistic updates:
    - `createTodo`: generate a temporary ID and insert into cache
    - `updateTodo`: merge changes directly into cache
    - `deleteTodo`: evict item from cache

### UI Structure
- `app/page.tsx`: main list view
    - TodoList: renders todos, loading, error states
    - TodoItem: toggles completion, edit title, delete
    - TodoForm: add new todo
    - FilterBar: all/active/completed
- Accessibility:
    - Buttons with aria-labels
    - Keyboard navigation for editing

### Example Usage
- Fetch todos:
    - Use `useQuery(GET_TODOS, { variables: { filter: { completed: null } } })`
- Add todo:
    - `useMutation(CREATE_TODO, { optimisticResponse, update(cache) { /* insert */ } })`
- Toggle complete:
    - `useMutation(UPDATE_TODO, { variables: { id, completed: !completed } })`
- Delete:
    - `useMutation(DELETE_TODO, { variables: { id }, update(cache) { /* evict */ } })`

### Server Notes (Django)
- Use Django with Strawberry GraphQL or Graphene to expose the schema
- Configure CORS (e.g., django-cors-headers) to allow Next.js origin
- Consider Django Channels for subscriptions via WebSocket
- Use Django authentication (sessions or tokens) and pass auth via headers
- Persist data with Postgres (via Django ORM) or another supported DB

### Testing
- Unit:
    - Mock Apollo with `MockedProvider`
    - Test components for loading/error/empty states
- e2e:
    - Seed test data
    - Validate create/edit/complete/delete flows
- Accessibility checks with `@testing-library/jest-dom` and axe

### Deployment
- Frontend:
    - Vercel or similar
    - Set env vars in hosting provider
- Backend (Django):
    - Deploy to Render, Fly.io, Railway, or a managed VPS
    - Ensure HTTPS, CORS, and proper ASGI/WSGI setup
- Cache + Revalidation:
    - Prefer client-side fetching via Apollo; avoid server caching for dynamic mutations

### Troubleshooting
- 401/403:
    - Verify token and header names
- CORS errors:
    - Add Next.js origin and allow credentials if needed
- Cache not updating:
    - Check `update` function and `cache.identify` keys
    - Ensure `id` and `__typename` are present
- Hydration mismatch:
    - Keep fetching client-side via `useQuery` in components
- TypeScript types:
    - Use GraphQL Code Generator to generate typed hooks

### Future Enhancements
- Pagination and infinite scroll
- Subscriptions for multi-client sync
- Offline support via Apollo cache persistence
- Server Actions for hybrid workflows
- Role-based auth and per-user lists
- Tag-based filtering and due dates
- Drag-and-drop reordering
- Optimized bundle via dynamic imports