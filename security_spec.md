# Security Specification: Vrind Homestay Firestore Security

## 1. Data Invariants
- Rooms catalog (`/rooms/{roomId}`): Public read access for prospective guests to browse available rooms. Write/update/delete operations strictly restricted to authenticated administrators.
- Bookings (`/bookings/{bookingId}`): Guests can create booking requests. Any user can create a booking request if fields are validated, or authenticated guests. Update and status transitions ('pending' -> 'confirmed' / 'cancelled') can only be done by administrators or the guest who created it (for cancellation). Total price and dates must be valid strings/numbers.
- Enquiries (`/enquiries/{enquiryId}`): Any prospective guest can submit a contact enquiry with validated name, email, and message. Only admins can read all enquiries or update their status.
- Reviews (`/reviews/{reviewId}`): Public read access. Create allowed for guests with valid rating (1-5) and content. Update/delete restricted to administrators.
- Admins (`/admins/{adminId}`): Only administrators can read or modify. Bootstrapped admin matches `anujkesharwani07p@gmail.com`.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Room Creation**: An unauthenticated user attempts to create a fake room in `/rooms/fake1`. Expected: PERMISSION_DENIED.
2. **Unauthenticated Room Price Alteration**: An unauthenticated user tries to update `/rooms/room1` setting `pricePerNight` to 0. Expected: PERMISSION_DENIED.
3. **Malicious Admin Promotion**: Non-admin user tries to write themselves into `/admins/attacker_uid`. Expected: PERMISSION_DENIED.
4. **Oversized Room Payload (Denial of Wallet)**: Attacker attempts to write a 1MB payload into a room record. Expected: PERMISSION_DENIED.
5. **Invalid Rating Review**: User submits review with `rating: 99` (outside 1-5). Expected: PERMISSION_DENIED.
6. **Negative Price Booking**: Attacker creates a booking with `totalPrice: -5000`. Expected: PERMISSION_DENIED.
7. **Ghost Field Injection in Booking**: Attacker adds ghost field `adminApproved: true` to bypass approval. Expected: PERMISSION_DENIED.
8. **Tampering with Another Guest's Booking**: User A tries to delete or alter User B's booking. Expected: PERMISSION_DENIED.
9. **Invalid Email Enquiry Injection**: Enquiry submitted without required email or with excessively long 50KB message. Expected: PERMISSION_DENIED.
10. **Arbitrary Collection Write**: Attempt to write to arbitrary collection `/passwords/steal`. Expected: PERMISSION_DENIED by global safety net.
11. **Id Poisoning Path Injection**: Attempting to query with malformed 2KB document ID. Expected: PERMISSION_DENIED.
12. **Unauthorized Status Escalation**: Guest trying to directly update their booking status to `confirmed` without admin privileges. Expected: PERMISSION_DENIED.
