# API Testing Summary - Meesho Seller Panel

## ✅ Backend Server Status

**Server:** Running on `http://localhost:5000`  
**MongoDB:** Connected  
**API Docs:** http://localhost:5000/api-docs

---

## 🧪 How to Test APIs

### Method 1: Using Frontend (Recommended)

1. **Start Backend:**
   ```bash
   cd D:\meesho\backend\MishoBackend
   node server.js
   ```

2. **Start Frontend:**
   ```bash
   cd D:\meesho\AdminPannal\MeshoAdminPanal  
   npm run dev
   ```

3. **Login as Seller:**
   - Open: http://localhost:5174
   - Login with your seller credentials
   - Seller ID automatically retrieved from localStorage

4. **Test Each Page:**
   - ✅ **Inventory Page** → http://localhost:5174/seller/inventory
   - ✅ **Payments Page** → http://localhost:5174/seller/payments
   - ✅ **Warehouse Page** → http://localhost:5174/seller/warehouse
   - ✅ **Claims Page** → http://localhost:5174/seller/claims
   - ✅ **Support Page** → http://localhost:5174/seller/support
   - ✅ **Quality Page** → http://localhost:5174/seller/quality
   - ✅ **Pricing Page** → http://localhost:5174/seller/pricing
   - ✅ **KYC Page** → http://localhost:5174/seller/kyc

---

### Method 2: Using Swagger UI

1. Open browser: http://localhost:5000/api-docs

2. Test endpoints directly:

#### Inventory APIs:
```
GET    /api/v1/inventory              # Get all inventory
GET    /api/v1/inventory/:id          # Get by ID
POST   /api/v1/inventory              # Create inventory
PUT    /api/v1/inventory/:id/stock    # Update stock
PUT    /api/v1/inventory/:id          # Update inventory
DELETE /api/v1/inventory/:id          # Delete inventory
GET    /api/v1/inventory/alerts/low-stock  # Get low stock items
POST   /api/v1/inventory/bulk-update  # Bulk update
```

#### Payment APIs:
```
GET    /api/v1/payments               # Get all payments
GET    /api/v1/payments/:id           # Get by ID  
POST   /api/v1/payments               # Create payment
PUT    /api/v1/payments/:id/status    # Update status
```

#### Warehouse APIs:
```
GET    /api/v1/warehouses             # Get all warehouses
GET    /api/v1/warehouses/:id         # Get by ID
POST   /api/v1/warehouses             # Create warehouse
PUT    /api/v1/warehouses/:id         # Update warehouse
DELETE /api/v1/warehouses/:id         # Delete warehouse
```

#### Claim APIs:
```
GET    /api/v1/claims                 # Get all claims
GET    /api/v1/claims/:id             # Get by ID
POST   /api/v1/claims                 # Create claim
PUT    /api/v1/claims/:id/status      # Update status
```

#### Support APIs:
```
GET    /api/v1/support                # Get all tickets
GET    /api/v1/support/:id            # Get by ID
POST   /api/v1/support                # Create ticket
POST   /api/v1/support/:id/message    # Add message
PUT    /api/v1/support/:id/status     # Update status
```

#### Quality APIs:
```
GET    /api/v1/quality                # Get all metrics
GET    /api/v1/quality/:id            # Get by ID
PUT    /api/v1/quality/:id            # Update metrics
```

#### Pricing APIs:
```
GET    /api/v1/pricing                # Get all pricing
GET    /api/v1/pricing/:id            # Get by ID
POST   /api/v1/pricing                # Create pricing
PUT    /api/v1/pricing/:id            # Update pricing
POST   /api/v1/pricing/:id/auto-price # Enable auto pricing
```

#### KYC APIs:
```
GET    /api/v1/kyc                    # Get KYC status
PUT    /api/v1/kyc/:id                # Update KYC
POST   /api/v1/kyc/submit             # Submit KYC
POST   /api/v1/kyc/upload             # Upload document
```

---

### Method 3: Using Browser Console

1. Open Seller Panel in browser
2. Open DevTools (F12) → Console tab
3. Run test commands:

```javascript
// Test Inventory API
fetch('http://localhost:5000/api/v1/inventory?sellerId=YOUR_SELLER_ID')
  .then(res => res.json())
  .then(data => console.log('Inventory:', data));

// Test Payments API
fetch('http://localhost:5000/api/v1/payments?sellerId=YOUR_SELLER_ID')
  .then(res => res.json())
  .then(data => console.log('Payments:', data));

// Test Warehouse API
fetch('http://localhost:5000/api/v1/warehouses?sellerId=YOUR_SELLER_ID')
  .then(res => res.json())
  .then(data => console.log('Warehouses:', data));
```

---

## 📊 Expected Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "stats": {...},
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50
    }
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔍 Verification Checklist

### For Each API Page:

#### ✅ Inventory Page
- [ ] Page loads without errors
- [ ] Stats cards show: Total Items, Low Stock, Out of Stock
- [ ] Product table displays with images, stock, status
- [ ] Search functionality works
- [ ] Update stock modal opens
- [ ] Stock update saves successfully
- [ ] Page auto-refreshes after update

#### ✅ Payments Page
- [ ] Page loads without errors
- [ ] Stats show: Total Earnings, Pending, This Month, Completed
- [ ] Payment history table displays
- [ ] Filter dropdown works (All, Completed, Pending, etc.)
- [ ] Transaction details show correctly
- [ ] Settlement dates display

#### ✅ Warehouse Page
- [ ] Page loads without errors
- [ ] Warehouse cards display
- [ ] "Add Warehouse" button opens modal
- [ ] Form validation works
- [ ] New warehouse creates successfully
- [ ] Edit/Delete buttons work
- [ ] Capacity calculations correct

#### ✅ Claims Page
- [ ] Page loads without errors
- [ ] Stats show: Active, Pending, Resolved
- [ ] Claims table displays
- [ ] "New Claim" button opens form
- [ ] Claim creation works
- [ ] Status badges display correctly

#### ✅ Support Page
- [ ] Page loads without errors
- [ ] Support tickets display
- [ ] Contact information visible
- [ ] Ticket creation works
- [ ] Message thread displays

#### ✅ Quality Page
- [ ] Page loads without errors
- [ ] Quality metrics display
- [ ] Quality score calculates
- [ ] Status indicator shows

#### ✅ Pricing Page
- [ ] Page loads without errors
- [ ] Price listings display
- [ ] Margin calculations correct
- [ ] Price update works
- [ ] Price history shows

#### ✅ KYC Page
- [ ] Page loads without errors
- [ ] Verification status displays
- [ ] Document upload works
- [ ] Form submission successful

---

## 🐛 Troubleshooting

### Issue: "404 Not Found"
**Solution:** 
- Check backend is running: http://localhost:5000/health
- Verify route is registered in `src/config/app.js`
- Check seller ID is correct

### Issue: "Network Error"
**Solution:**
- Backend not running → Start with `node server.js`
- CORS issue → Check CORS settings in `app.js`
- Wrong API URL → Check `.env` file

### Issue: "Empty Data"
**Solution:**
- No data in database → Create test data manually
- Wrong seller ID → Check localStorage for correct ID
- Query filters too restrictive → Remove filters

### Issue: "Validation Error"
**Solution:**
- Missing required fields → Check form data
- Incorrect data types → Verify number/string types
- Schema mismatch → Check model definition

---

## 📝 Quick Test Commands

### Test Server Health:
```bash
curl http://localhost:5000/health
```

### Test Inventory API:
```bash
curl "http://localhost:5000/api/v1/inventory?sellerId=YOUR_ID"
```

### Test Payment API:
```bash
curl "http://localhost:5000/api/v1/payments?sellerId=YOUR_ID"
```

### Create Test Warehouse (PowerShell):
```powershell
$body = @{
  sellerId = "YOUR_SELLER_ID"
  name = "Test Warehouse"
  location = @{
    address = "123 Test St"
    city = "Mumbai"
    state = "Maharashtra"
    pincode = "400001"
    country = "India"
  }
  capacity = @{
    total = 1000
  }
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/v1/warehouses" -Body $body -ContentType "application/json"
```

---

## ✨ Current Status

**Backend APIs:** ✅ All 8 modules working  
**Database:** ✅ Connected to MongoDB Atlas  
**Frontend Integration:** ✅ All pages integrated  
**Service Layer:** ✅ All service files created  
**Documentation:** ✅ Swagger UI available  

---

## 🎯 Next Steps

1. **Test Locally:**
   - Start backend: `node server.js`
   - Start frontend: `npm run dev`
   - Test each page manually

2. **Check Production:**
   - Wait for Render deployment (already pushed)
   - Test on: https://mesho-admin-panal-3wfa.vercel.app
   - Backend: https://mishobackend.onrender.com

3. **Verify Data Flow:**
   - Create → Read → Update → Delete operations
   - Stats calculations
   - Search/filter functionality
   - Pagination

---

**Last Updated:** December 10, 2025  
**Status:** ✅ Ready for Testing  
**Backend:** Running on localhost:5000  
**Frontend:** Running on localhost:5174
