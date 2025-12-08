# Meesho Admin/Seller Authentication - Short Guide (Hinglish)

## Saar (Overview)
Yeh document batata hai ki Seller aur Admin ke liye Login/Signup ka process kya hai — frontend (UI) aur backend (API) ka flow kya hota hai, kaunse endpoints use hote hain, kaunse localStorage keys store hoti hain, aur kuch common debug tips.

---

## Important API endpoints (frontend `authService` ke hisaab se)
- `POST /auth/check-phone`  — phone number DB mein hai ya nahi
- `POST /auth/send-otp`     — OTP bhejna
- `POST /auth/verify-otp`   — OTP verify karke login/register
- `POST /auth/register`     — naya seller register karna (onboarding data)
- `POST /auth/direct-login` — kuch flows mein direct login (no OTP)
- `POST /auth/login`        — Admin email/password login
- `POST /auth/logout`       — Logout
- `GET  /auth/me`           — Logged-in user details

---

## Seller (Phone + OTP) — Summary
1. User ya seller login/signup page par phone dalta hai.
2. Frontend `checkPhone(phone)` call karke dekhta hai ki number pehle se registered hai ya nahi (`isExistingUser`, `hasSellerProfile`).
   - Agar number registered hai → frontend pe "Click here to Login" ya OTP flow show karo.
   - Agar naya number hai → `sendOtp(phone)` karke OTP bhejo aur "Register & Continue" dikhao.
3. OTP bhejne ke baad user `verifyOtp(phone, otp)` bhejta hai.
   - Backend success par `token` aur `user` return karega.
   - Frontend `localStorage` mein `authToken` aur `user` (JSON) store karta hai.
   - Backend response mein `requiresOnboarding` ho sakta hai — agar true ho to seller ko onboarding / complete profile page pe bhejo (jaise `/seller-register`).
4. Agar user successfully registered aur seller profile complete hai → redirect `/seller` dashboard.
5. Common frontend methods (dekho `authService`): `sendOtp`, `verifyOtp`, `checkPhone`, `register`, `directLogin`.

Key localStorage keys:
- `authToken`  — JWT/token
- `user`       — serialized user object (JSON)
- `isAuthenticated` — optional flag set to `'true'`

Dev/Test OTP: Login page dev setup mein test OTP `999000` dikhata hai (agar backend seeded ho).

---

## Admin (Email + Password) — Summary
1. Admin login form mein email aur password dalta hai.
2. Frontend `authService.login(email, password)` → `POST /auth/login`.
3. Backend success par response mein `data.token` aur `data.user` return karta hai.
4. Frontend store karta hai:
   - `authToken` ← token
   - `user` ← JSON user
   - `userEmail` ← email (layouts mein use hota hai)
5. Redirect admin to admin dashboard (`/` ya configured route).

Dev test credentials: `admin@meesho.com` / `Admin@123` (Login.jsx mein listed).

---

## Direct login (convenience)
- `directLogin(phone)` endpoint kuch setups mein quick login allow karta hai (no OTP). Agar backend `success` return kare to frontend same tarike se token aur user store karta hai jaise OTP flow.

---

## Frontend redirect & role checks
- `SellerLayout` aur `AdminLayout` mount par `localStorage` user data check karte hain:
  - Agar `authToken` ya `user` missing ho → redirect to `/login`.
  - Agar `user.role` mismatch ho (e.g., seller admin page pe) → appropriate area pe redirect karo (`/seller` ya `/login`).
  - Layouts `document.documentElement.classList.remove('dark')` call karte hain taaki theme light rahe.

---

## Error handling & debug tips
- Agar login baar-baar `/login` pe aa raha hai:
  - DevTools → Application → Local Storage check karo: `authToken` aur `user` present hain?
  - Agar missing hai to backend token return nahi kar raha — Network tab mein `verify-otp` ya `login` responses check karo.
- OTP nahi aa raha:
  - Dev mein test OTP (`999000`) try karo agar backend seeded ho; otherwise backend logs aur SMS provider settings check karo.
- Clean start karne ke liye browser console mein `localStorage.clear()` run karo aur reload karo.
- Agar `401/403` aa raha hai to token expire ya invalid ho sakta hai — ensure `Authorization: Bearer <token>` header `api` client bhej raha hai.

---

## How to test locally (quick)
1. Backend start karo (backend folder se), example:
   ```powershell
   cd d:\meesho\backend\MishoBackend
   npm install
   npm run dev   # ya node server.js depending on package.json
   ```
2. Frontend (Admin Panel) start karo:
   ```powershell
   cd d:\meesho\AdminPannal\MeshoAdminPanal
   npm install
   npm run dev
   ```
3. App open karo, `/login` pe jaake test karo:
   - Seller: phone enter karke OTP flow follow karo (ya test OTP use karo)
   - Admin: `admin@meesho.com` / `Admin@123`

(Exact scripts `package.json` pe depend karte hain.)

---

## Quick Troubleshooting Checklist
- Network: ensure frontend backend reachable (CORS, base API URL in `src/services/api.js`).
- LocalStorage: token present? (`authToken`, `user`)
- Role mismatch: correct redirect (Admin → `/`, Seller → `/seller`).
- Onboarding: agar `requiresOnboarding` true aaye after `verifyOtp`, seller onboarding complete karo.

---

## Where to look in code
- Frontend service: `src/services/authService.js` (methods: `checkPhone`, `sendOtp`, `verifyOtp`, `register`, `login`, `directLogin`)
- Layout redirects: `src/components/layout/AdminLayout.jsx`, `src/components/layout/SellerLayout.jsx`
- Login page(s): `src/pages/Login.jsx` (Admin panel), `UserWebsite/.../Login.jsx` (user site)

---

