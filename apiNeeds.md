# Backend API Needs (Frontend Requirements)

This document outlines the missing endpoints, data fields, and architectural features required by the React frontend that are not currently present in `backendApi.md`.

## 1. Booking Slot Management (Double-Booking Prevention)
The frontend requires a functional `GET /bookings/availability` endpoint to prevent clients from booking overlapping times. 
- **Current Status:** `backendApi.md` states this returns `{"message": "Not implemented yet"}`.
- **Requirement:** This API must accept a `date` and optional `staff_id`, and return an array of booked times/durations or a list of available 15-minute slot blocks for that day.
- **Example Expected Response:**
  ```json
  {
    "booked_slots": [
      { "time": "10:00:00", "duration_minutes": 45, "staff_id": "uuid-123" },
      { "time": "14:30:00", "duration_minutes": 60, "staff_id": "uuid-123" }
    ]
  }
  ```

## 2. Staff Authentication & RBAC (Role-Based Access Control)
Currently, `POST /auth/register` creates a generic User, and `PUT /users/{id}/make-admin` makes them an Admin. However, the Spa requires a "Staff" role.
- **Requirement 1:** A way to link a `User` account to a `Staff` profile. (e.g., `user_id` foreign key on the `Staff` table).
- **Requirement 2:** When calling `GET /users/me` or logging in, the payload needs to return the user's role (`"role": "admin" | "staff" | "customer"`). 
- **Requirement 3:** If the role is `"staff"`, the API should also return their associated `staff_id` so the frontend knows which appointments belong to them.

## 3. Missing Entities: Packages, Offers, & Gallery
The frontend design includes pages for Packages, Offers, and a Gallery, but there are no endpoints for these in `backendApi.md`.
- **Requirement:** We need CRUD endpoints for:
  - `GET /packages` and `GET /admin/packages`
  - `GET /offers`, `POST /admin/offers`, `PUT /admin/offers/{id}`, etc.
  - `GET /gallery`
- *(Note: Until these are implemented, the frontend will use static mock data for these sections to prevent app crashes).*

## 4. Review Author Avatars
The `GET /reviews` endpoint currently only returns `customer_id`. 
- **Requirement:** To display reviews beautifully, we need the customer's `name` and ideally an `image_url`. The backend should join the `User` table and return `customer_name` directly in the `GET /reviews` response payload to save the frontend from making N+1 API calls.
