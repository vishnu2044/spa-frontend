# API Validations

This document details all Pydantic field validations applied across the Aura Wellness API to ensure data integrity and prevent internal server errors (such as the 72-character bcrypt limit).

## Validation Failure Response Format

When validation fails, FastAPI automatically returns a **422 Unprocessable Entity** status code. The response body contains a JSON array indicating exactly which fields failed validation.

### Example 422 Response

```json
{
  "detail": [
    {
      "type": "string_too_long",
      "loc": [
        "body",
        "password"
      ],
      "msg": "String should have at most 72 characters",
      "input": "super_long_password_...",
      "ctx": {
        "max_length": 72
      }
    }
  ]
}
```

## Schema Constraints

### 1. Users (`user.py`)
| Field | Constraints |
| --- | --- |
| `name` | `min_length=2`, `max_length=50` |
| `phone` | `min_length=10`, `max_length=15` |
| `password` | `min_length=8`, `max_length=12` |
| `email` | Must be a valid email string |

### 2. Bookings (`booking.py`)
| Field | Constraints |
| --- | --- |
| `guest_name` | `min_length=2`, `max_length=50` |
| `guest_phone` | `min_length=10`, `max_length=15` |
| `total_amount` | `ge=0` (greater than or equal to 0) |
| `special_notes` | `max_length=500` |

### 3. Services (`service.py`)
| Field | Constraints |
| --- | --- |
| `CategoryBase.name` | `min_length=2`, `max_length=50` |
| `ServiceBase.name` | `min_length=2`, `max_length=100` |
| `duration_minutes` | `gt=0` (greater than 0) |
| `price` | `ge=0` |
| `description` | `max_length=1000` |

### 4. Staff (`staff.py`)
| Field | Constraints |
| --- | --- |
| `name` | `min_length=2`, `max_length=50` |
| `role` | `min_length=2`, `max_length=50` |
| `experience_years` | `ge=0` |
| `bio` | `max_length=1000` |

### 5. Offers & Packages (`offer.py`)
| Field | Constraints |
| --- | --- |
| `OfferBase.title` | `min_length=2`, `max_length=100` |
| `OfferBase.description` | `max_length=1000` |
| `PackageBase.name` | `min_length=2`, `max_length=100` |
| `PackageBase.price` | `ge=0` |

### 6. Reviews (`review.py`)
| Field | Constraints |
| --- | --- |
| `rating` | `ge=1`, `le=5` |
| `text` | `max_length=1000` |

### 7. Gallery (`gallery.py`)
| Field | Constraints |
| --- | --- |
| `alt_text` | `max_length=100` |
| `caption` | `max_length=500` |
