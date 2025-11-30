# Audit Trail Implementation

## Overview
Complete audit trail system has been implemented to track who created and updated records. **Admins and Managers** can see which user (admin, manager, accountant, or staff) created or updated each entry, payment, or invoice.

## Backend Changes

### Models Updated
All models now include `createdBy` and `updatedBy` fields that reference the User model:
- **Booking** - tracks who created/updated bookings
- **Payment** - tracks who created/updated payments
- **Invoice** - tracks who created/updated invoices
- **Customer** - tracks who created/updated customers

### Routes Updated
All routes now:
1. Capture the authenticated user's ID when creating records (`createdBy`)
2. Capture the authenticated user's ID when updating records (`updatedBy`)
3. Populate `createdBy` and `updatedBy` fields when returning data
4. Use optional authentication (works with or without authentication for backward compatibility)

### Routes Modified
- `/api/bookings` - POST, PUT now capture user IDs
- `/api/payments` - POST, PUT now capture user IDs
- `/api/invoices` - POST, PUT now capture user IDs
- `/api/customers` - POST, PUT now capture user IDs

## Frontend Changes

### Audit Trail Display
**Admins and Managers** can see:
- **Created by** column showing who created the record
- **Updated by** column showing who last updated the record

### Pages Updated
1. **Daily Entries** - Shows "Created by" and "Updated by" columns for bookings
2. **Payments** - Shows "Created by" and "Updated by" columns for payments
3. **Invoices** - (Can be added similarly)
4. **Customers** - (Can be added similarly)

### Role-Based Visibility
- Only **Admin** and **Manager** roles can see audit trail information
- **Accountant** and **Staff** roles cannot see who created/updated records
- This ensures accountability while maintaining privacy for lower-level users

## How It Works

1. **When a user creates a record:**
   - The system captures the authenticated user's ID
   - Stores it in the `createdBy` field
   - Populates the user's name when displaying

2. **When a user updates a record:**
   - The system captures the authenticated user's ID
   - Stores it in the `updatedBy` field
   - Populates the user's name when displaying

3. **Display:**
   - Shows user's name (or username if name not available)
   - Shows "N/A" if no user information available
   - Only visible to Admins and Managers

## Example Usage

### For Admins/Managers:
- View all bookings and see who created each one
- Track which staff member updated a payment
- Monitor which accountant generated an invoice
- Identify who last modified customer information

### For Accountants/Staff:
- Cannot see audit trail information
- Can still create and update records normally
- Their actions are tracked but not visible to them

## Benefits

1. **Accountability** - Know exactly who made changes
2. **Audit Compliance** - Track all modifications
3. **Error Tracking** - Identify who made mistakes
4. **Performance Monitoring** - See which users are most active
5. **Security** - Detect unauthorized changes

## Technical Details

- Uses MongoDB ObjectId references to User model
- Populates user data when fetching records
- Optional authentication ensures backward compatibility
- Role-based UI filtering prevents unauthorized viewing



