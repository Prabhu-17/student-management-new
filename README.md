# student-management-new
 

FrontEnd deployed link - https://student-management-new-9cw2.vercel.app/login
Backend deployed on render


For DB- mongoDB atlas 

Student Management System (Frontend + Backend)

Tech stack

Frontend: Vite + React (Hooks) + Tailwind CSS + React Router + React Query + Axios + Framer Motion + shadcn-style UI

Backend: Node.js + Express

Database: MongoDB (works with local mongod or Atlas)

Auth: JWT

File uploads: Express static /uploads

Extras: Excel import/export endpoints (server-side), audit logs, RBAC (Admin / Teacher) 

Backend — install & run

cd backend

npm install

Create .env using the sample above.

Ensure MongoDB is running locally or use Atlas MONGO_URI.

Start the server:

Dev: npm run dev (should use nodemon script)

Prod: npm start

Example package.json scripts 

Frontend — install & run

cd frontend

npm install

Create .env with VITE_API_BASE_URL pointing to your backend.

Run dev server:

npm run dev (Vite)

Build for production:

npm run build

Preview: npm run preview

Frontend stores JWT tokens in localStorage (configured in AuthContext). Axios interceptor attaches Authorization: Bearer <token>. 

Sample API endpoints (implemented on backend)

Auth

POST /api/auth/register — register (returns auth tokens & user)

POST /api/auth/login — login (returns auth tokens & user)

POST /api/auth/refresh — refresh tokens

POST /api/auth/logout — logout

Students

GET /api/students — list (supports query params: page, pageSize, search, class, gender)

Response shape expected: { items: [], page: 1, pageSize: 10, total: number }

GET /api/students/:id — get student

POST /api/students — create student (multipart/form-data if file upload)

PUT /api/students/:id — update student (multipart/form-data if file upload)

DELETE /api/students/:id — delete student

POST /api/students/:id/photo — upload profile photo (multipart/form-data)

GET /api/students/export/xlsx/all — export XLSX (admin)

POST /api/students/import/xlsx — import XLSX (admin, multipart)

Analytics

GET /api/analytics — returns e.g. { totalStudents, studentsPerClass: [{class, count}], genderRatio: [{ gender, count }] }

Logs (audit)

GET /api/logs — list logs (admin only)

Authentication & client usage

After successful login/register, server returns tokens and user object.

Frontend stores tokens in localStorage under tokens and user under profile.

Axios interceptor automatically sets Authorization header.

React Query handles data fetching and invalidation.

RBAC:

user.role === 'admin' → full CRUD (Add/Edit/Delete/Import/Export)

user.role === 'teacher' → view-only

Excel import/export & uploads

Export endpoint returns an XLSX blob. Frontend triggers download and names file students.xlsx.

Import expects multipart/form-data file field name file.

Uploading a profile photo:

Frontend forms construct FormData and append the file under profilePhoto (or as backend expects).

Uploaded images are served from /uploads by the backend static middleware:

app.use('/uploads', express.static('uploads'))

Seeding sample users (Admin & Teacher)

If your backend has no seeder, you can create two users via API or direct DB insert.

