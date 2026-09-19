# Backend Needs for Booking Flow

The frontend booking flow relies on specific APIs to fetch data and submit the appointment. If the "Book Appointment" page is showing nothing (empty services list), it means the backend is either returning an empty list `[]` or the API is failing.

Here is exactly what the backend needs to provide for the Booking flow to work correctly.

## 1. Seed Data Requirements (Empty Database)
If your backend database is completely fresh, you **must** add data to it before the booking page will show anything. 
You need to add at least:
- **1 Category** (e.g., "Hair")
- **1 Service** (linked to the category)
- **1 Staff Member** (linked to the same category/specialty)

You can add this data either directly into your database (using SQL inserts) or via the frontend Admin Panel (`/admin/services` and `/admin/staff`) if your POST APIs are fully working.

---

## 2. API Response Formats Expected by Frontend

### `GET /api/v1/services`
The frontend needs to group services by category. To do this, the backend **must** return the category name along with the service, not just the `category_id`.

**Required JSON Shape:**
```json
[
  {
    "id": "uuid-1234",
    "name": "Classic Haircut",
    "duration_minutes": 45,
    "price": 50.00,
    "image_url": "https://...",
    // CRITICAL: Frontend needs the category name, either as a nested object or string
    "category": { 
      "id": "uuid-cat",
      "name": "Hair"
    }
  }
]
```
*(If your API only returns `category_id`, the frontend won't know the category name to display in the tabs).*

### `GET /api/v1/staff`
The frontend needs to filter staff based on the service the user selected. It does this by checking the staff's specialties/categories.

**Required JSON Shape:**
```json
[
  {
    "id": "uuid-5678",
    "name": "Sarah Jenkins",
    "role": "Senior Stylist",
    "image_url": "https://...",
    "rating_cache": 4.8,
    // CRITICAL: Frontend needs to know what categories this staff member handles
    "specialties": [
      { "category": "Hair" }
    ]
  }
]
```

### `POST /api/v1/bookings`
When the user confirms the booking, the frontend sends this payload. Your Pydantic schemas must accept this exact structure:

**Frontend Payload Sent:**
```json
{
  "service_id": "uuid-1234",
  "staff_id": "uuid-5678",  // Can be null if user selects "Any Available"
  "booking_date": "2026-09-25",
  "booking_time": "10:00",
  "guest_name": "John Doe",
  "guest_phone": "9876543210",
  "guest_email": "john@example.com",
  "special_notes": "Allergic to certain shampoos"
}
```

## Summary Action Items for You:
1. **Add Seed Data:** Manually insert a Category, Service, and Staff into your database.
2. **Update `GET /services`**: Use SQLAlchemy `joinedload` (or similar) to include the `category` relation so it returns the category name.
3. **Update `GET /staff`**: Include the staff's `specialties` relation so the frontend knows what services they can perform.
