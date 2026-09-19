# Aura Wellness Spa Backend API Documentation

This document serves as the complete reference for the frontend team regarding the Backend API. It includes details about all available endpoints, expected request payloads, data validations, and expected response formats.

**Base URL:** `https://your-render-url.onrender.com/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user account.

**Request Payload (`application/json`)**
```json
{
  "name": "John Doe",           // String: min_length=2, max_length=50
  "email": "john@example.com",  // String: Valid email address format
  "phone": "9876543210",        // String: min_length=10, max_length=15
  "password": "mySecurePassword"// String: min_length=8, max_length=128
}
```

**Validations:**
- `422 Unprocessable Entity` if constraints are violated.
- `400 Bad Request` if the email already exists in the system.

**Response (200 OK)**
Returns the created `User` object (excluding the password).

---

### `POST /auth/login`
Authenticates a user and returns a JWT access token.
**Important:** This endpoint expects `application/x-www-form-urlencoded` (OAuth2 spec) instead of JSON.

**Request Payload (`application/x-www-form-urlencoded`)**
- `username`: The user's email address.
- `password`: The user's password.

**Validations:**
- `401 Unauthorized` if incorrect email or password.

**Response (200 OK)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 2. Public Endpoints (Services & Staff)

### `GET /services`
Fetches a list of all active spa services.

**Query Parameters:**
- `skip` (Integer, default: 0)
- `limit` (Integer, default: 100)

**Validations:** No specific validations on query parameters other than being valid integers.

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "name": "Classic Haircut",
    "duration_minutes": 45,
    "price": 50.0,
    "image_url": "https://...",
    "description": "...",
    "before_care_instructions": "...",
    "is_popular": true,
    "status": "active",
    "category_id": "uuid",
    "category": {
      "id": "uuid",
      "name": "Hair"
    }
  }
]
```

---

### `GET /staff`
Fetches a list of all staff members and their specialties.

**Query Parameters:**
- `skip` (Integer, default: 0)
- `limit` (Integer, default: 100)

**Validations:** No specific validations.

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "name": "Sarah Jenkins",
    "role": "Senior Stylist",
    "experience_years": 8,
    "bio": "...",
    "image_url": "https://...",
    "working_hours": "...",
    "is_active": true,
    "rating_cache": 4.8,
    "review_count_cache": 24,
    "specialties": [
      {
        "id": 1,
        "staff_id": "uuid",
        "category": "Hair"
      }
    ],
    "working_days": []
  }
]
```

### `GET /staff/{id}`
Get details of a specific staff member.

**Path Parameters:**
- `id` (String UUID)

**Validations:**
- `404 Not Found` if staff member does not exist.

**Response (200 OK)**
Returns a single `Staff` object (same structure as above array item).

---

## 3. Booking Endpoints

### `GET /bookings/availability`
Fetch available time slots.

**Query Parameters:**
- `date`: (String)
- `staff_id`: (String, Optional)
- `service_duration`: (Integer, Optional)

**Validations:** None.

**Response (200 OK)**
```json
{
  "booked_slots": [
    {
      "time": "10:00:00",
      "duration_minutes": 45,
      "staff_id": "uuid-123"
    }
  ]
}
```

---

### `POST /bookings`
Creates a new appointment booking.

**Request Payload (`application/json`)**
```json
{
  "guest_name": "John Doe",                // Optional String (min=2, max=50)
  "guest_phone": "9876543210",             // Optional String (min=10, max=15)
  "guest_email": "john@example.com",       // Optional String (Valid Email)
  "service_id": "uuid",                    // Required UUID
  "staff_id": "uuid",                      // Optional UUID (can be null for 'Any')
  "booking_date": "2026-09-25",            // Required Date (YYYY-MM-DD format)
  "booking_time": "10:00:00",              // Required Time (HH:MM:SS format)
  "total_amount": 50.0,                    // Optional Float (ge=0, defaults to 0.0)
  "special_notes": "Allergies..."          // Optional String (max 500 chars)
}
```

**Validations:**
- `422 Unprocessable Entity` if constraints are violated.

**Response (200 OK)**
Returns the newly created `Booking` object.

---

### `GET /bookings/user/{customer_id}`
Fetches bookings belonging to a specific customer.

**Path Parameters:**
- `customer_id` (String UUID)

**Validations:** No specific validations.

**Response (200 OK)**
Returns an array of `Booking` objects.

---

### `PUT /bookings/{id}/cancel`
Cancels an upcoming booking.

**Path Parameters:**
- `id` (String UUID)

**Validations:**
- `404 Not Found` if the booking does not exist.

**Response (200 OK)**
Returns the updated `Booking` object with `status: "cancelled"`.

---

## 4. Admin Endpoints

### `GET /admin/dashboard/stats`
Get daily revenue, pending, and completed appointments counts.

**Validations:** Currently returns a placeholder message.

---

### `GET /admin/bookings`
Fetches all bookings in the system for the Admin Panel dashboard.

**Query Parameters:**
- `skip` (Integer, default: 0)
- `limit` (Integer, default: 100)

**Response (200 OK)**
Includes deeply nested objects for `customer`, `service`, and `staff` to populate the frontend table.
```json
[
  {
    "id": "AURA-2026-0917-AB12",
    "customer_id": "uuid",
    "guest_name": "John Doe",
    "guest_phone": "9876543210",
    "guest_email": "john@example.com",
    "service_id": "uuid",
    "staff_id": "uuid",
    "booking_date": "2026-09-25",
    "booking_time": "10:00:00",
    "status": "pending",
    "total_amount": 50.0,
    "special_notes": "...",
    "created_at": "2026-09-17T10:00:00Z",
    "updated_at": "2026-09-17T10:00:00Z",
    "customer": { },
    "service": {
       "id": "uuid",
       "name": "Classic Haircut"
    },
    "staff": {
       "id": "uuid",
       "name": "Sarah Jenkins"
    }
  }
]
```

---

### `POST /admin/services`
Creates a new service (requires Admin privileges).

**Request Payload (`application/json`)**
```json
{
  "name": "Massage",            // Required String (min=2, max=100)
  "duration_minutes": 60,       // Required Integer (gt=0)
  "price": 100.0,               // Required Float (ge=0)
  "image_url": "https://...",   // Optional String
  "description": "...",         // Optional String (max 1000 chars)
  "before_care_instructions": "",// Optional String
  "is_popular": false,          // Optional Boolean
  "status": "active",           // Optional Enum ('active', 'inactive')
  "category_id": "uuid"         // Required UUID
}
```

**Validations:**
- `422 Unprocessable Entity` for invalid field lengths/values.

**Response (200 OK)**
Returns the created `Service` object.

---

### `GET /admin/staff`
Fetches all staff members. (Identical to `GET /staff` but inside the admin router scope).

---

### `POST /admin/staff`
Creates a new staff member (requires Admin privileges).

**Request Payload (`application/json`)**
```json
{
  "name": "Sarah Jenkins",      // Required String (min=2, max=50)
  "role": "Senior Stylist",     // Required String (min=2, max=50)
  "experience_years": 8,        // Optional Integer (ge=0)
  "bio": "...",                 // Optional String (max 1000 chars)
  "image_url": "https://...",   // Optional String
  "working_hours": "...",       // Optional String
  "is_active": true             // Optional Boolean
}
```

**Validations:**
- `422 Unprocessable Entity` if constraints are violated.

**Response (200 OK)**
Returns the created `Staff` object.

---

## 5. User Management Endpoints

### `GET /users`
Retrieve all users.

**Validations:** No specific validations.

---

### `GET /users/me`
Get current user details.

**Validations:** No specific validations.

**Response (200 OK)**
```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "staff",
  "staff_id": "uuid" // Included if user has a staff profile
}
```

---

### `GET /users/{user_id}`
Get a specific user by ID.

**Path Parameters:**
- `user_id` (String UUID)

**Validations:**
- `404 Not Found` if user doesn't exist.

---

### `PUT /users/{user_id}`
Update a specific user.

**Path Parameters:**
- `user_id` (String UUID)

**Request Payload (`application/json`)**
```json
{
  "name": "Jane Doe",           // Optional String
  "phone": "1234567890",        // Optional String
  "password": "newSecurePassword"// Optional String
}
```

**Validations:**
- `404 Not Found` if user doesn't exist.
- `422 Unprocessable Entity` for malformed constraints.

---

### `GET /users/{user_id}/rewards`
Get a user's reward points.

**Path Parameters:**
- `user_id` (String UUID)

**Validations:**
- `404 Not Found` if user doesn't exist.

**Response (200 OK)**
```json
{
  "points": 150
}
```

---

### `PUT /users/{user_id}/make-admin`
Elevate a user to admin role.

**Validations:**
- `404 Not Found` if user doesn't exist.

**Response (200 OK)**
Returns the updated `User` object.

---

### `PUT /users/{user_id}/block`
Block a user from using the platform.

**Validations:**
- `404 Not Found` if user doesn't exist.

**Response (200 OK)**
Returns the updated `User` object.

---

### `PUT /users/{user_id}/unblock`
Unblock a user.

**Validations:**
- `404 Not Found` if user doesn't exist.

**Response (200 OK)**
Returns the updated `User` object.

---

## 6. Review Endpoints

### `GET /reviews`
Retrieve published reviews.

**Query Parameters:**
- `skip` (Integer, default: 0)
- `limit` (Integer, default: 100)

**Validations:** No specific validations. Returns only reviews where `status` is `published`.

**Response (200 OK)**
```json
[
  {
    "id": "uuid",
    "customer_id": "uuid",
    "service_id": "uuid",
    "staff_id": "uuid",
    "rating": 5.0,
    "comment": "Great service!",
    "status": "published",
    "created_at": "2026-09-17T10:00:00Z",
    "customer": {
       "id": "uuid",
       "name": "John Doe"
    }
  }
]
```

---

### `POST /reviews`
Submit a new review.

**Query Parameters:**
- `customer_id` (String)

**Request Payload (`application/json`)**
```json
{
  "service_id": "uuid",         // Optional UUID
  "staff_id": "uuid",           // Optional UUID
  "rating": 5.0,                // Required Float (ge=1.0, le=5.0)
  "comment": "Amazing!"         // Optional String (min=2, max=1000)
}
```

**Validations:**
- `422 Unprocessable Entity` if constraints are violated (e.g., rating > 5.0).

**Response (200 OK)**
Returns the created `Review` object.
 
 # #   7 .   O f f e r s ,   P a c k a g e s ,   a n d   G a l l e r y   E n d p o i n t s 
 
 # # #   ` G E T   / o f f e r s ` 
 R e t r i e v e   a c t i v e   o f f e r s . 
 
 * * R e s p o n s e   ( 2 0 0   O K ) * * 
 ` ` ` j s o n 
 [ 
     { 
         " i d " :   " u u i d " , 
         " t i t l e " :   " S u m m e r   S p e c i a l " , 
         " d e s c r i p t i o n " :   " 2 0 %   o f f   a l l   m a s s a g e s " , 
         " d i s c o u n t _ l a b e l " :   " 2 0 %   O F F " , 
         " p r o m o _ c o d e " :   " S U M M E R 2 0 " , 
         " s t a t u s " :   " a c t i v e " , 
         " h a s _ c o u n t d o w n " :   f a l s e 
     } 
 ] 
 ` ` ` 
 
 # # #   ` P O S T   / o f f e r s ` 
 C r e a t e   a   n e w   o f f e r   ( A d m i n   o n l y ) . 
 
 * * R e q u e s t   P a y l o a d   ( ` a p p l i c a t i o n / j s o n ` ) * * 
 R e q u i r e s   ` t i t l e ` .   O t h e r   f i e l d s   o p t i o n a l . 
 
 # # #   ` G E T   / p a c k a g e s ` 
 R e t r i e v e   a l l   p a c k a g e s . 
 
 * * R e s p o n s e   ( 2 0 0   O K ) * * 
 ` ` ` j s o n 
 [ 
     { 
         " i d " :   " u u i d " , 
         " n a m e " :   " B r i d a l   P a c k a g e " , 
         " p r i c e " :   2 9 9 . 9 9 , 
         " d u r a t i o n _ m i n u t e s " :   1 8 0 , 
         " i s _ p o p u l a r " :   t r u e 
     } 
 ] 
 ` ` ` 
 
 # # #   ` P O S T   / p a c k a g e s ` 
 C r e a t e   a   n e w   p a c k a g e   ( A d m i n   o n l y ) . 
 
 * * R e q u e s t   P a y l o a d   ( ` a p p l i c a t i o n / j s o n ` ) * * 
 R e q u i r e s   ` n a m e ` ,   ` p r i c e ` ,   a n d   ` d u r a t i o n _ m i n u t e s ` . 
 
 # # #   ` G E T   / g a l l e r y ` 
 R e t r i e v e   g a l l e r y   i t e m s . 
 
 * * R e s p o n s e   ( 2 0 0   O K ) * * 
 ` ` ` j s o n 
 [ 
     { 
         " i d " :   " u u i d " , 
         " i m a g e _ u r l " :   " h t t p s : / / . . . " , 
         " c a p t i o n " :   " B e a u t i f u l   s p a   i n t e r i o r " 
     } 
 ] 
 ` ` ` 
 
 # # #   ` P O S T   / g a l l e r y ` 
 C r e a t e   a   n e w   g a l l e r y   i t e m   ( A d m i n   o n l y ) . 
 
 * * R e q u e s t   P a y l o a d   ( ` a p p l i c a t i o n / j s o n ` ) * * 
 R e q u i r e s   ` i m a g e _ u r l ` . 
  
 