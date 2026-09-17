# Aura Wellness – Backend Configuration & Schema Design

This document outlines the architecture, database schema, and REST API endpoints required to transition the Aura Wellness frontend from `localStorage` to a fully functional backend system.

---

## 1. Database Schema

The database can be implemented using SQL (PostgreSQL/MySQL) or NoSQL (MongoDB). Below is the relational (SQL-like) representation of the required entities.

### 1.1 User Management (Customers & Admins)
Table: `Users`
- `id` (UUID, Primary Key)
- `role` (ENUM: `'customer'`, `'admin'`) - *Default: 'customer'*
- `name` (String)
- `email` (String, Unique)
- `phone` (String, Unique)
- `password_hash` (String)
- `points` (Integer) - *For Aura Rewards*
- `join_date` (DateTime)
- `membership_plan_id` (UUID, Foreign Key) - *Optional*
- `created_at` (DateTime)
- `updated_at` (DateTime)

### 1.2 Staff (Specialists)
Table: `Staff`
- `id` (UUID, Primary Key)
- `name` (String)
- `role` (String) - *e.g., 'Senior Hair Stylist'*
- `experience_years` (Integer)
- `bio` (Text)
- `image_url` (String)
- `working_hours` (String) - *e.g., '9:00 AM - 6:00 PM'*
- `is_active` (Boolean) - *Default: true*
- `rating_cache` (Float) - *Aggregated from reviews*
- `review_count_cache` (Integer)

Table: `StaffSpecialties` (Many-to-Many map)
- `staff_id` (UUID, Foreign Key)
- `category` (String) - *e.g., 'Hair', 'Skin'*

Table: `StaffWorkingDays` (One-to-Many)
- `staff_id` (UUID, Foreign Key)
- `day_of_week` (ENUM: `'Monday'`, `'Tuesday'`, etc.)

### 1.3 Services & Categories
Table: `Categories`
- `id` (UUID, Primary Key)
- `name` (String, Unique) - *e.g., 'Hair', 'Spa'*

Table: `Services`
- `id` (UUID, Primary Key)
- `category_id` (UUID, Foreign Key)
- `name` (String)
- `duration_minutes` (Integer)
- `price` (Decimal)
- `image_url` (String)
- `description` (Text)
- `before_care_instructions` (Text)
- `is_popular` (Boolean)
- `status` (ENUM: `'active'`, `'inactive'`)

### 1.4 Bookings (Appointments)
Table: `Bookings`
- `id` (String, Primary Key) - *Custom format e.g., 'AURA-2026-0917-1001'*
- `customer_id` (UUID, Foreign Key) - *Nullable for guest checkouts, though linking to Users is preferred*
- `guest_name` (String) - *Fallback if no account*
- `guest_phone` (String)
- `guest_email` (String)
- `service_id` (UUID, Foreign Key)
- `staff_id` (UUID, Foreign Key) - *Nullable if 'Any Available'*
- `booking_date` (Date)
- `booking_time` (Time)
- `status` (ENUM: `'pending'`, `'confirmed'`, `'completed'`, `'cancelled'`)
- `total_amount` (Decimal)
- `special_notes` (Text)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### 1.5 Reviews
Table: `Reviews`
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key)
- `booking_id` (String, Foreign Key) - *Optional, for verified reviews*
- `service_id` (UUID, Foreign Key)
- `rating` (Integer, 1-5)
- `text` (Text)
- `is_verified` (Boolean) - *True if linked to a completed booking*
- `status` (ENUM: `'published'`, `'hidden'`) - *Admin can hide reviews*
- `created_at` (DateTime)

### 1.6 Offers & Packages
Table: `Offers`
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `discount_label` (String) - *e.g., '20% OFF'*
- `promo_code` (String)
- `category_id` (UUID, Foreign Key) - *Nullable if applicable to 'All'*
- `status` (ENUM: `'active'`, `'inactive'`)
- `has_countdown` (Boolean)
- `end_time` (DateTime) - *Required if has_countdown is true*

Table: `Packages`
- `id` (UUID, Primary Key)
- `name` (String)
- `tagline` (String)
- `description` (Text)
- `price` (Decimal)
- `original_price` (Decimal)
- `duration_minutes` (Integer)
- `color_theme` (String)
- `is_popular` (Boolean)

### 1.7 Gallery (Portfolio)
Table: `GalleryItems`
- `id` (UUID, Primary Key)
- `category_id` (UUID, Foreign Key)
- `image_url` (String)
- `thumbnail_url` (String)
- `alt_text` (String)
- `caption` (String)
- `is_before_after` (Boolean) - *Flag for slider components*
- `before_image_url` (String) - *If is_before_after is true*

---

## 2. API Endpoints

All endpoints should be prefixed with `/api/v1`. Authentication requires a Bearer JWT token in the `Authorization` header.

### 2.1 Authentication & User Management
* **POST** `/auth/register` - Create a new customer account.
* **POST** `/auth/login` - Authenticate user/admin and return JWT.
* **GET** `/users/me` - Get current user profile (Auth required).
* **PUT** `/users/me` - Update profile info (name, phone, email) (Auth required).
* **GET** `/users/me/rewards` - Fetch current points and unlocked benefits (Auth required).

### 2.2 Bookings
* **GET** `/bookings/availability` - Fetch available time slots.
  * *Query Params:* `date` (YYYY-MM-DD), `staff_id` (Optional), `service_duration` (Int)
* **POST** `/bookings` - Create a new booking (Public/Auth).
* **GET** `/bookings/me` - Fetch upcoming and past bookings for the logged-in user.
* **PUT** `/bookings/:id/cancel` - Cancel an upcoming booking (Auth required, must belong to user).

### 2.3 Services & Packages (Public)
* **GET** `/services` - List all active services (filter by category via query param).
* **GET** `/packages` - List all curated packages.
* **GET** `/offers` - List all active offers and promotions.

### 2.4 Staff & Team (Public)
* **GET** `/staff` - List all active staff members.
* **GET** `/staff/:id` - Get specific staff details, reviews, and specialties.

### 2.5 Reviews & Gallery (Public)
* **GET** `/reviews` - Fetch published reviews (pagination supported).
* **POST** `/reviews` - Submit a new review (Auth required).
* **GET** `/gallery` - Fetch gallery images and before/after transformations.

---

## 3. Admin APIs (Requires `role='admin'`)

These endpoints power the Admin Dashboard and require an admin JWT token.

### 3.1 Dashboard Metrics
* **GET** `/admin/dashboard/stats` - Get daily revenue, pending/completed appointments counts.

### 3.2 Appointment Management
* **GET** `/admin/bookings` - List all bookings (filter by date, status).
* **PUT** `/admin/bookings/:id/status` - Update booking status (`completed`, `cancelled`).

### 3.3 Service Management
* **POST** `/admin/services` - Create a new service.
* **PUT** `/admin/services/:id` - Edit service details.
* **DELETE** `/admin/services/:id` - Delete or soft-delete a service.

### 3.4 Staff Management
* **POST** `/admin/staff` - Add a new staff member.
* **PUT** `/admin/staff/:id` - Edit staff details.
* **PATCH** `/admin/staff/:id/availability` - Toggle active/inactive status.
* **DELETE** `/admin/staff/:id` - Remove a staff member.

### 3.5 Offer Management
* **POST** `/admin/offers` - Create a new promotional offer.
* **PUT** `/admin/offers/:id` - Update an offer.
* **PATCH** `/admin/offers/:id/status` - Activate or pause an offer.
* **DELETE** `/admin/offers/:id` - Delete an offer.

### 3.6 Review Moderation
* **GET** `/admin/reviews` - List all reviews (including hidden).
* **PATCH** `/admin/reviews/:id/visibility` - Hide or publish a review.
* **DELETE** `/admin/reviews/:id` - Permanently delete a review.

---

## 4. Security & Business Logic Notes
1. **Concurrency Control:** When creating a booking (`POST /bookings`), the system must lock the requested time slot for the specific `staff_id` to prevent double-booking.
2. **Rewards System:** Add points to `Users.points` incrementally when a booking status changes to `'completed'`.
3. **Admin Overrides:** Admins have the right to cancel bookings without restriction, while customers can only cancel if `booking_date` > current date/time.
4. **Data Privacy:** Passwords must be hashed using `bcrypt` or `argon2`. Phone numbers and emails should be sanitized.
