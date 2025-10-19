# 🚀 Complete Backend API Documentation
## Crowdfunding Platform - Spring Boot Backend

**Base URL:** `http://localhost:8080/api/v1`  
**Authentication:** JWT Bearer Token (where required)  
**Content-Type:** `application/json`

---

## 📑 Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Profile APIs](#2-profile-apis)
3. [Campaign APIs](#3-campaign-apis)
4. [Donation APIs](#4-donation-apis)
5. [Withdrawal APIs](#5-withdrawal-apis)
6. [Bank Account APIs](#6-bank-account-apis)
7. [Campaign Update APIs](#7-campaign-update-apis)
8. [Comment APIs](#8-comment-apis)
9. [Like APIs](#9-like-apis)
10. [Follow APIs](#10-follow-apis)
11. [Notification APIs](#11-notification-apis)
12. [Report APIs](#12-report-apis)
13. [Search APIs](#13-search-apis)
14. [Post APIs](#14-post-apis)
15. [Reel APIs](#15-reel-apis)
16. [Payment APIs](#16-payment-apis-to-be-implemented)

---

## 1. Authentication APIs

### 1.1 Register User
**Endpoint:** `POST /auth/register`  
**Authentication:** Not required  
**Description:** Register a new user account

**Request Body:**
```json
{
  "username": "string (3-30 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (8-120 chars, required)",
  "confirmPassword": "string (must match password, required)"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully. Please login with your credentials."
}
```

**Validation Rules:**
- Username: 3-30 characters, alphanumeric
- Email: Valid email format
- Password: 8-120 characters
- Confirm password must match password

---

### 1.2 Login User
**Endpoint:** `POST /auth/login`  
**Authentication:** Not required  
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### 1.3 Refresh Token
**Endpoint:** `POST /auth/refresh`  
**Authentication:** Required (Bearer Token)  
**Description:** Refresh expired JWT token

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_jwt_token",
  "tokenType": "Bearer"
}
```

---

### 1.4 Logout User
**Endpoint:** `POST /auth/logout`  
**Authentication:** Required  
**Description:** Logout user (invalidate token on backend if implemented)

**Response:** `200 OK`
```json
{
  "message": "User logged out successfully."
}
```

---

### 1.5 Validate Token
**Endpoint:** `GET /auth/validate`  
**Authentication:** Required  
**Description:** Validate if current token is valid

**Response:** `200 OK`
```json
{
  "message": "Token is valid"
}
```

---

## 2. Profile APIs

### 2.1 Create Profile
**Endpoint:** `POST /profiles`  
**Authentication:** Required  
**Description:** Create user profile after registration

**Request Body:**
```json
{
  "name": "string (2-50 chars, required)",
  "bio": "string (max 150 chars, optional)",
  "profilePictureUrl": "string (URL, optional)",
  "isPrivate": "boolean (default: false)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "johndoe",
  "name": "John Doe",
  "bio": "Passionate about social causes",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "followersCount": 0,
  "followingCount": 0,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 2.2 Get Profile
**Endpoint:** `GET /profiles/{userId}`  
**Authentication:** Optional (public profiles visible without auth)  
**Description:** Get user profile by ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "johndoe",
  "name": "John Doe",
  "bio": "Passionate about social causes",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "followersCount": 234,
  "followingCount": 156,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 2.3 Update Profile
**Endpoint:** `PUT /profiles/{userId}`  
**Authentication:** Required (own profile only)  
**Description:** Update user profile

**Request Body:**
```json
{
  "name": "string (max 100 chars, optional)",
  "bio": "string (max 500 chars, optional)",
  "profilePictureUrl": "string (URL, optional)"
}
```

**Response:** `200 OK` (same as Get Profile)

---

## 3. Campaign APIs

### 3.1 Create Campaign
**Endpoint:** `POST /campaigns`  
**Authentication:** Required  
**Description:** Create a new crowdfunding campaign

**Request Body:**
```json
{
  "creatorId": 1,
  "title": "string (5-200 chars, required)",
  "description": "string (50-5000 chars, required)",
  "goalAmount": 100000.00,
  "currency": "INR",
  "category": "string (required)",
  "startDate": "2024-02-01T00:00:00",
  "endDate": "2024-03-01T00:00:00",
  "imageUrl": "string (URL, optional)",
  "videoUrl": "string (URL, optional)",
  "beneficiaryName": "string (2-100 chars, required)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "creatorId": 1,
  "creatorUsername": "johndoe",
  "creatorName": "John Doe",
  "creatorProfilePicture": "https://example.com/avatar.jpg",
  "title": "Help Build Community Center",
  "description": "We are building...",
  "goalAmount": 100000.00,
  "currentAmount": 0.00,
  "currency": "INR",
  "category": "Social",
  "status": "DRAFT",
  "startDate": "2024-02-01T00:00:00",
  "endDate": "2024-03-01T00:00:00",
  "imageUrl": "https://example.com/campaign.jpg",
  "videoUrl": null,
  "isVerified": false,
  "beneficiaryName": "Community Foundation",
  "donorCount": 0,
  "likesCount": 0,
  "commentsCount": 0,
  "liked": false,
  "progressPercentage": 0.00,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

### 3.2 Get Campaign by ID
**Endpoint:** `GET /campaigns/{campaignId}?userId={userId}`  
**Authentication:** Optional  
**Description:** Get single campaign details

**Query Parameters:**
- `userId` (optional): To check if user liked the campaign

**Response:** `200 OK` (same as Create Campaign response)

---

### 3.3 Update Campaign
**Endpoint:** `PUT /campaigns/{campaignId}`  
**Authentication:** Required (creator only)  
**Description:** Update campaign details

**Request Body:** Same as Create Campaign

**Response:** `200 OK`

---

### 3.4 Publish Campaign
**Endpoint:** `POST /campaigns/{campaignId}/publish?creatorId={creatorId}`  
**Authentication:** Required  
**Description:** Publish a draft campaign

**Response:** `200 OK`

---

### 3.5 Pause Campaign
**Endpoint:** `POST /campaigns/{campaignId}/pause?creatorId={creatorId}`  
**Authentication:** Required  
**Description:** Pause an active campaign

**Response:** `200 OK`

---

### 3.6 Resume Campaign
**Endpoint:** `POST /campaigns/{campaignId}/resume?creatorId={creatorId}`  
**Authentication:** Required  
**Description:** Resume a paused campaign

**Response:** `200 OK`

---

### 3.7 Approve Campaign (Admin)
**Endpoint:** `POST /campaigns/{campaignId}/approve?adminId={adminId}`  
**Authentication:** Required (admin only)  
**Description:** Approve a campaign for publishing

**Response:** `200 OK`

---

### 3.8 Get Active Campaigns
**Endpoint:** `GET /campaigns/active?userId={userId}&page={page}&size={size}&sort={sort}`  
**Authentication:** Optional  
**Description:** Get all active campaigns with pagination

**Query Parameters:**
- `userId` (optional): Check liked status for user
- `page` (default: 0): Page number
- `size` (default: 20): Items per page
- `sort` (optional): Sort criteria

**Response:** `200 OK`
```json
{
  "content": [
    { /* Campaign objects */ }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false
}
```

---

### 3.9 Get Campaigns by Category
**Endpoint:** `GET /campaigns/category/{category}?userId={userId}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get campaigns filtered by category

**Response:** `200 OK` (Paginated list)

**Categories:**
- Technology
- Art
- Design
- Health
- Education
- Social
- Environment
- Entertainment

---

### 3.10 Get User Campaigns
**Endpoint:** `GET /campaigns/user/{creatorId}?viewerId={viewerId}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all campaigns created by a user

**Query Parameters:**
- `viewerId` (optional): To check liked status
- `page`, `size`: Pagination

**Response:** `200 OK` (Paginated list)

---

### 3.11 Get Campaign Progress
**Endpoint:** `GET /campaigns/{campaignId}/progress`  
**Authentication:** Optional  
**Description:** Get funding progress percentage

**Response:** `200 OK`
```json
45.50
```

---

## 4. Donation APIs

### 4.1 Create Donation
**Endpoint:** `POST /donations`  
**Authentication:** Required  
**Description:** Make a donation to a campaign

**Request Body:**
```json
{
  "campaignId": 1,
  "donorId": 1,
  "amount": 5000.00,
  "currency": "INR",
  "isAnonymous": false,
  "message": "string (max 500 chars, optional)",
  "paymentMethod": "UPI",
  "paymentDetails": {
    "transactionId": "TXN123456",
    "upiId": "user@upi"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "campaignId": 1,
  "campaignTitle": "Help Build Community Center",
  "donorId": 1,
  "donorUsername": "johndoe",
  "donorName": "John Doe",
  "donorProfilePicture": "https://example.com/avatar.jpg",
  "amount": 5000.00,
  "currency": "INR",
  "message": "Happy to support!",
  "paymentStatus": "SUCCESS",
  "paymentMethod": "UPI",
  "transactionId": "TXN123456",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

### 4.2 Get Donation by ID
**Endpoint:** `GET /donations/{donationId}`  
**Authentication:** Required  
**Description:** Get donation details

**Response:** `200 OK` (same as Create)

---

### 4.3 Refund Donation (Admin)
**Endpoint:** `POST /donations/{donationId}/refund?adminId={adminId}&reason={reason}`  
**Authentication:** Required (admin only)  
**Description:** Process refund for a donation

**Response:** `200 OK`

---

### 4.4 Get Campaign Donations
**Endpoint:** `GET /donations/campaign/{campaignId}?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all donations for a campaign

**Response:** `200 OK` (Paginated list)

---

### 4.5 Get User Donations
**Endpoint:** `GET /donations/user/{userId}?page={page}&size={size}`  
**Authentication:** Required  
**Description:** Get donation history for a user

**Response:** `200 OK` (Paginated list)

---

### 4.6 Get Total Donations
**Endpoint:** `GET /donations/campaign/{campaignId}/total`  
**Authentication:** Optional  
**Description:** Get total donation amount for campaign

**Response:** `200 OK`
```json
75000.00
```

---

### 4.7 Get Unique Donor Count
**Endpoint:** `GET /donations/campaign/{campaignId}/donors/count`  
**Authentication:** Optional  
**Description:** Get number of unique donors

**Response:** `200 OK`
```json
234
```

---

## 5. Withdrawal APIs

### 5.1 Request Withdrawal
**Endpoint:** `POST /withdrawals`  
**Authentication:** Required (campaign creator)  
**Description:** Request withdrawal of funds

**Request Body:**
```json
{
  "campaignId": 1,
  "requesterId": 1,
  "bankAccountId": 1,
  "amount": 50000.00,
  "currency": "INR",
  "reason": "string (max 500 chars, optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "campaignId": 1,
  "campaignTitle": "Help Build Community Center",
  "requesterId": 1,
  "requesterUsername": "johndoe",
  "amount": 50000.00,
  "currency": "INR",
  "platformFee": 2500.00,
  "paymentGatewayFee": 1000.00,
  "netAmount": 46500.00,
  "bankAccountId": 1,
  "bankAccountMasked": "****1234",
  "status": "PENDING",
  "transactionReference": null,
  "reason": "First milestone completed",
  "rejectionReason": null,
  "approvedAt": null,
  "processedAt": null,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 5.2 Get Withdrawal by ID
**Endpoint:** `GET /withdrawals/{withdrawalId}`  
**Authentication:** Required  
**Description:** Get withdrawal details

**Response:** `200 OK` (same as Create)

---

### 5.3 Approve Withdrawal (Admin)
**Endpoint:** `POST /withdrawals/{withdrawalId}/approve?adminId={adminId}&notes={notes}`  
**Authentication:** Required (admin only)  
**Description:** Approve withdrawal request

**Response:** `200 OK`

---

### 5.4 Reject Withdrawal (Admin)
**Endpoint:** `POST /withdrawals/{withdrawalId}/reject?adminId={adminId}&reason={reason}`  
**Authentication:** Required (admin only)  
**Description:** Reject withdrawal request

**Response:** `200 OK`

---

### 5.5 Get Campaign Withdrawals
**Endpoint:** `GET /withdrawals/campaign/{campaignId}?page={page}&size={size}`  
**Authentication:** Required  
**Description:** Get all withdrawals for a campaign

**Response:** `200 OK` (Paginated list)

---

### 5.6 Get User Withdrawals
**Endpoint:** `GET /withdrawals/user/{userId}?page={page}&size={size}`  
**Authentication:** Required  
**Description:** Get withdrawal history for user

**Response:** `200 OK` (Paginated list)

---

### 5.7 Get Pending Withdrawals (Admin)
**Endpoint:** `GET /withdrawals/pending?page={page}&size={size}`  
**Authentication:** Required (admin only)  
**Description:** Get all pending withdrawals

**Response:** `200 OK` (Paginated list)

---

### 5.8 Get Total Withdrawn
**Endpoint:** `GET /withdrawals/campaign/{campaignId}/total`  
**Authentication:** Optional  
**Description:** Get total withdrawn amount

**Response:** `200 OK`
```json
50000.00
```

---

## 6. Bank Account APIs

### 6.1 Add Bank Account
**Endpoint:** `POST /bank-accounts`  
**Authentication:** Required  
**Description:** Add bank account for withdrawals

**Request Body:**
```json
{
  "profileId": 1,
  "accountHolderName": "John Doe",
  "accountNumber": "1234567890",
  "bankName": "State Bank of India",
  "ifscCode": "SBIN0001234",
  "swiftCode": null,
  "routingNumber": null,
  "accountType": "SAVINGS",
  "branchName": "Main Branch",
  "country": "IN",
  "currency": "INR",
  "isPrimary": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "profileId": 1,
  "accountHolderName": "John Doe",
  "accountNumberMasked": "****7890",
  "bankName": "State Bank of India",
  "ifscCode": "SBIN0001234",
  "swiftCode": null,
  "routingNumber": null,
  "accountType": "SAVINGS",
  "branchName": "Main Branch",
  "country": "IN",
  "currency": "INR",
  "isPrimary": true,
  "isVerified": false,
  "isActive": true,
  "verifiedAt": null,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 6.2 Get Bank Account
**Endpoint:** `GET /bank-accounts/{accountId}?profileId={profileId}`  
**Authentication:** Required  
**Description:** Get bank account details

**Response:** `200 OK` (same as Add)

---

### 6.3 Update Bank Account
**Endpoint:** `PUT /bank-accounts/{accountId}`  
**Authentication:** Required  
**Description:** Update bank account details

**Request Body:** Same as Add

**Response:** `200 OK`

---

### 6.4 Delete Bank Account
**Endpoint:** `DELETE /bank-accounts/{accountId}?profileId={profileId}`  
**Authentication:** Required  
**Description:** Delete bank account

**Response:** `204 No Content`

---

### 6.5 Get User Bank Accounts
**Endpoint:** `GET /bank-accounts/user/{profileId}`  
**Authentication:** Required  
**Description:** Get all bank accounts for user

**Response:** `200 OK`
```json
[
  { /* Bank account objects */ }
]
```

---

### 6.6 Get Primary Bank Account
**Endpoint:** `GET /bank-accounts/user/{profileId}/primary`  
**Authentication:** Required  
**Description:** Get primary bank account

**Response:** `200 OK` (Single bank account object)

---

### 6.7 Verify Bank Account (Admin)
**Endpoint:** `POST /bank-accounts/{accountId}/verify?adminId={adminId}`  
**Authentication:** Required (admin only)  
**Description:** Verify bank account

**Response:** `200 OK`

---

### 6.8 Upload Verification Document
**Endpoint:** `POST /bank-accounts/{accountId}/verification-document?profileId={profileId}&documentUrl={documentUrl}`  
**Authentication:** Required  
**Description:** Upload verification document

**Response:** `200 OK`

---

## 7. Campaign Update APIs

### 7.1 Create Update
**Endpoint:** `POST /campaign-updates`  
**Authentication:** Required (campaign creator)  
**Description:** Post update for campaign

**Request Body:**
```json
{
  "campaignId": 1,
  "creatorId": 1,
  "title": "string (5-200 chars, required)",
  "content": "string (10-5000 chars, required)",
  "imageUrl": "string (URL, optional)",
  "videoUrl": "string (URL, optional)",
  "isMilestone": false,
  "milestoneDescription": "string (max 500 chars, optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "campaignId": 1,
  "campaignTitle": "Help Build Community Center",
  "creatorId": 1,
  "creatorUsername": "johndoe",
  "title": "50% Milestone Reached!",
  "content": "We are thrilled to announce...",
  "imageUrl": "https://example.com/update.jpg",
  "videoUrl": null,
  "isMilestone": true,
  "milestoneDescription": "Reached 50% of our goal",
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 7.2 Get Update by ID
**Endpoint:** `GET /campaign-updates/{updateId}`  
**Authentication:** Optional  
**Description:** Get single update

**Response:** `200 OK` (same as Create)

---

### 7.3 Update Campaign Update
**Endpoint:** `PUT /campaign-updates/{updateId}`  
**Authentication:** Required (creator only)  
**Description:** Edit campaign update

**Request Body:** Same as Create

**Response:** `200 OK`

---

### 7.4 Delete Update
**Endpoint:** `DELETE /campaign-updates/{updateId}?creatorId={creatorId}`  
**Authentication:** Required (creator only)  
**Description:** Delete campaign update

**Response:** `204 No Content`

---

### 7.5 Get Campaign Updates
**Endpoint:** `GET /campaign-updates/campaign/{campaignId}?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all updates for campaign

**Response:** `200 OK` (Paginated list)

---

### 7.6 Get Campaign Milestones
**Endpoint:** `GET /campaign-updates/campaign/{campaignId}/milestones?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get milestone updates only

**Response:** `200 OK` (Paginated list)

---

### 7.7 Get Recent Updates
**Endpoint:** `GET /campaign-updates/recent?count={count}`  
**Authentication:** Optional  
**Description:** Get recent updates across all campaigns

**Query Parameters:**
- `count` (default: 10): Number of updates

**Response:** `200 OK`
```json
[
  { /* Update objects */ }
]
```

---

### 7.8 Get Updates by Creator
**Endpoint:** `GET /campaign-updates/creator/{creatorId}?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all updates from a creator

**Response:** `200 OK` (Paginated list)

---

## 8. Comment APIs

### 8.1 Create Comment
**Endpoint:** `POST /comments`  
**Authentication:** Required  
**Description:** Add comment to post/reel/campaign

**Request Body:**
```json
{
  "userId": 1,
  "content": "string (max 2200 chars, required)",
  "postId": "post123",
  "reelId": null,
  "campaignId": null,
  "parentCommentId": null
}
```

**Response:** `201 Created`
```json
{
  "id": "comment123",
  "userId": 1,
  "username": "johndoe",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "content": "Great initiative!",
  "postId": "post123",
  "reelId": null,
  "campaignId": null,
  "parentCommentId": null,
  "likeCount": 0,
  "replyCount": 0,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

### 8.2 Update Comment
**Endpoint:** `PUT /comments/{commentId}`  
**Authentication:** Required (comment owner)  
**Description:** Edit comment

**Request Body:**
```json
{
  "userId": 1,
  "content": "string (updated content)"
}
```

**Response:** `200 OK`

---

### 8.3 Delete Comment
**Endpoint:** `DELETE /comments/{commentId}?userId={userId}`  
**Authentication:** Required (comment owner)  
**Description:** Delete comment

**Response:** `204 No Content`

---

### 8.4 Get Post Comments
**Endpoint:** `GET /comments/post/{postId}?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all comments on a post

**Response:** `200 OK` (Paginated list)

---

### 8.5 Get Reel Comments
**Endpoint:** `GET /comments/reel/{reelId}?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all comments on a reel

**Response:** `200 OK` (Paginated list)

---

### 8.6 Get Campaign Comments
**Endpoint:** `GET /comments/campaign/{campaignId}?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all comments on a campaign

**Response:** `200 OK` (Paginated list)

---

### 8.7 Get Comment Replies
**Endpoint:** `GET /comments/{parentCommentId}/replies?page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get replies to a comment

**Response:** `200 OK` (Paginated list)

---

### 8.8 Like Comment
**Endpoint:** `POST /comments/{commentId}/like`  
**Authentication:** Required  
**Description:** Like a comment

**Response:** `200 OK`

---

### 8.9 Unlike Comment
**Endpoint:** `DELETE /comments/{commentId}/like`  
**Authentication:** Required  
**Description:** Unlike a comment

**Response:** `200 OK`

---

## 9. Like APIs

### 9.1 Like Content
**Endpoint:** `POST /likes`  
**Authentication:** Required  
**Description:** Like post/reel/campaign

**Request Body:**
```json
{
  "userId": 1,
  "postId": "post123",
  "reelId": null,
  "campaignId": null
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "userId": 1,
  "postId": "post123",
  "reelId": null,
  "campaignId": null,
  "contentType": "POST",
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 9.2 Unlike Content
**Endpoint:** `DELETE /likes`  
**Authentication:** Required  
**Description:** Remove like

**Request Body:** Same as Like

**Response:** `204 No Content`

---

### 9.3 Get Post Likes Count
**Endpoint:** `GET /likes/post/{postId}/count`  
**Authentication:** Optional  
**Description:** Get like count for post

**Response:** `200 OK`
```json
2340
```

---

### 9.4 Get Reel Likes Count
**Endpoint:** `GET /likes/reel/{reelId}/count`  
**Authentication:** Optional  
**Description:** Get like count for reel

**Response:** `200 OK`
```json
1890
```

---

### 9.5 Get Campaign Likes Count
**Endpoint:** `GET /likes/campaign/{campaignId}/count`  
**Authentication:** Optional  
**Description:** Get like count for campaign

**Response:** `200 OK`
```json
567
```

---

### 9.6 Check if Post Liked by User
**Endpoint:** `GET /likes/post/{postId}/user/{userId}`  
**Authentication:** Optional  
**Description:** Check if user liked the post

**Response:** `200 OK`
```json
true
```

---

### 9.7 Check if Reel Liked by User
**Endpoint:** `GET /likes/reel/{reelId}/user/{userId}`  
**Authentication:** Optional  
**Description:** Check if user liked the reel

**Response:** `200 OK`
```json
false
```

---

### 9.8 Check if Campaign Liked by User
**Endpoint:** `GET /likes/campaign/{campaignId}/user/{userId}`  
**Authentication:** Optional  
**Description:** Check if user liked the campaign

**Response:** `200 OK`
```json
true
```

---

## 10. Follow APIs

### 10.1 Follow User
**Endpoint:** `POST /follows/{followingId}/follow?followerId={followerId}`  
**Authentication:** Required  
**Description:** Follow another user

**Response:** `200 OK`

---

### 10.2 Unfollow User
**Endpoint:** `DELETE /follows/{followingId}/unfollow?followerId={followerId}`  
**Authentication:** Required  
**Description:** Unfollow user

**Response:** `204 No Content`

---

### 10.3 Approve Follow Request
**Endpoint:** `POST /follows/requests/{followerId}/approve?followingId={followingId}`  
**Authentication:** Required  
**Description:** Approve pending follow request (for private accounts)

**Response:** `200 OK`

---

### 10.4 Reject Follow Request
**Endpoint:** `POST /follows/requests/{followerId}/reject?followingId={followingId}`  
**Authentication:** Required  
**Description:** Reject follow request

**Response:** `200 OK`

---

### 10.5 Block User
**Endpoint:** `POST /follows/{blockedId}/block?blockerId={blockerId}`  
**Authentication:** Required  
**Description:** Block a user

**Response:** `200 OK`

---

### 10.6 Unblock User
**Endpoint:** `DELETE /follows/{blockedId}/unblock?blockerId={blockerId}`  
**Authentication:** Required  
**Description:** Unblock a user

**Response:** `204 No Content`

---

### 10.7 Get Followers
**Endpoint:** `GET /follows/{userId}/followers`  
**Authentication:** Optional  
**Description:** Get list of followers

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": 2,
      "username": "janedoe",
      "name": "Jane Doe",
      "profilePictureUrl": "https://example.com/avatar2.jpg",
      "isPrivate": false
    }
  ],
  "totalCount": 234
}
```

---

### 10.8 Get Following
**Endpoint:** `GET /follows/{userId}/following`  
**Authentication:** Optional  
**Description:** Get list of users being followed

**Response:** `200 OK` (same structure as Get Followers)

---

### 10.9 Get Pending Follow Requests
**Endpoint:** `GET /follows/{userId}/requests`  
**Authentication:** Required (own profile)  
**Description:** Get pending follow requests

**Response:** `200 OK` (same structure as Get Followers)

---

### 10.10 Get Blocked Users
**Endpoint:** `GET /follows/{userId}/blocked`  
**Authentication:** Required (own profile)  
**Description:** Get list of blocked users

**Response:** `200 OK` (same structure as Get Followers)

---

### 10.11 Check if Following
**Endpoint:** `GET /follows/{followerId}/follows/{followingId}`  
**Authentication:** Optional  
**Description:** Check if user A follows user B

**Response:** `200 OK`
```json
true
```

---

## 11. Notification APIs

### 11.1 Get User Notifications
**Endpoint:** `GET /notifications/user/{userId}?page={page}&size={size}`  
**Authentication:** Required  
**Description:** Get notifications for user

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "type": "DONATION",
      "message": "donated ₹5,000 to your campaign",
      "isRead": false,
      "actorId": 2,
      "actorUsername": "janedoe",
      "actorProfilePicture": "https://example.com/avatar2.jpg",
      "postId": null,
      "reelId": null,
      "commentId": null,
      "campaignId": 1,
      "actionUrl": "/campaign/1",
      "createdAt": "2024-01-15T10:30:00",
      "readAt": null
    }
  ],
  "totalElements": 45,
  "totalPages": 3
}
```

**Notification Types:**
- `DONATION` - Someone donated
- `FOLLOW` - New follower
- `LIKE` - Content liked
- `COMMENT` - New comment
- `MILESTONE` - Campaign milestone
- `CAMPAIGN_UPDATE` - New campaign update
- `WITHDRAWAL_APPROVED` - Withdrawal approved
- `WITHDRAWAL_REJECTED` - Withdrawal rejected

---

### 11.2 Get Unread Count
**Endpoint:** `GET /notifications/user/{userId}/unread/count`  
**Authentication:** Required  
**Description:** Get count of unread notifications

**Response:** `200 OK`
```json
12
```

---

### 11.3 Mark as Read
**Endpoint:** `PUT /notifications/{notificationId}/read?userId={userId}`  
**Authentication:** Required  
**Description:** Mark single notification as read

**Response:** `200 OK`

---

### 11.4 Mark All as Read
**Endpoint:** `PUT /notifications/user/{userId}/read-all`  
**Authentication:** Required  
**Description:** Mark all notifications as read

**Response:** `200 OK`

---

### 11.5 Delete Notification
**Endpoint:** `DELETE /notifications/{notificationId}?userId={userId}`  
**Authentication:** Required  
**Description:** Delete notification

**Response:** `204 No Content`

---

## 12. Report APIs

### 12.1 Create Report
**Endpoint:** `POST /reports`  
**Authentication:** Required  
**Description:** Report inappropriate content/user

**Request Body:**
```json
{
  "reportedByUserId": 1,
  "reportedUserId": 2,
  "contentType": "CAMPAIGN",
  "reason": "SPAM",
  "description": "string (optional)",
  "postId": null,
  "reelId": null,
  "commentId": null,
  "campaignId": 1
}
```

**Content Types:**
- `POST`, `REEL`, `COMMENT`, `CAMPAIGN`, `PROFILE`

**Report Reasons:**
- `SPAM`, `HARASSMENT`, `FAKE`, `INAPPROPRIATE`, `COPYRIGHT`, `OTHER`

**Response:** `201 Created`
```json
{
  "id": 1,
  "reportedByUserId": 1,
  "reportedByUsername": "johndoe",
  "contentType": "CAMPAIGN",
  "reason": "SPAM",
  "description": "This campaign appears fraudulent",
  "status": "PENDING",
  "postId": null,
  "reelId": null,
  "commentId": null,
  "campaignId": 1,
  "reportedUserId": 2,
  "reportedUsername": "janedoe",
  "actionTaken": null,
  "reviewNotes": null,
  "reviewedAt": null,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 12.2 Get Report by ID
**Endpoint:** `GET /reports/{reportId}`  
**Authentication:** Required (admin or reporter)  
**Description:** Get report details

**Response:** `200 OK` (same as Create)

---

### 12.3 Review Report (Admin)
**Endpoint:** `POST /reports/{reportId}/review?adminId={adminId}&action={action}&notes={notes}`  
**Authentication:** Required (admin only)  
**Description:** Review and take action on report

**Query Parameters:**
- `action`: `APPROVE`, `REJECT`, `WARN_USER`, `SUSPEND_USER`, `DELETE_CONTENT`

**Response:** `200 OK`

---

### 12.4 Resolve Report (Admin)
**Endpoint:** `POST /reports/{reportId}/resolve?adminId={adminId}&action={action}&notes={notes}`  
**Authentication:** Required (admin only)  
**Description:** Mark report as resolved

**Response:** `200 OK`

---

### 12.5 Dismiss Report (Admin)
**Endpoint:** `POST /reports/{reportId}/dismiss?adminId={adminId}&reason={reason}`  
**Authentication:** Required (admin only)  
**Description:** Dismiss invalid report

**Response:** `200 OK`

---

### 12.6 Escalate Report (Admin)
**Endpoint:** `POST /reports/{reportId}/escalate?adminId={adminId}&notes={notes}`  
**Authentication:** Required (admin only)  
**Description:** Escalate report to higher authority

**Response:** `200 OK`

---

### 12.7 Get Pending Reports (Admin)
**Endpoint:** `GET /reports/pending?page={page}&size={size}`  
**Authentication:** Required (admin only)  
**Description:** Get all pending reports

**Response:** `200 OK` (Paginated list)

---

### 12.8 Get Reports by Status (Admin)
**Endpoint:** `GET /reports/status/{status}?page={page}&size={size}`  
**Authentication:** Required (admin only)  
**Description:** Get reports filtered by status

**Status Values:**
- `PENDING`, `REVIEWING`, `RESOLVED`, `DISMISSED`, `ESCALATED`

**Response:** `200 OK` (Paginated list)

---

### 12.9 Get User Reports
**Endpoint:** `GET /reports/user/{userId}?page={page}&size={size}`  
**Authentication:** Required (own reports or admin)  
**Description:** Get reports filed by user

**Response:** `200 OK` (Paginated list)

---

## 13. Search APIs

### 13.1 Search All
**Endpoint:** `GET /search?query={query}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Search across profiles, posts, reels

**Query Parameters:**
- `query` (required): Search term
- `page`, `size`: Pagination

**Response:** `200 OK`
```json
{
  "profiles": {
    "content": [ /* Profile objects */ ],
    "totalElements": 10
  },
  "posts": {
    "content": [ /* Post objects */ ],
    "totalElements": 5
  },
  "reels": {
    "content": [ /* Reel objects */ ],
    "totalElements": 8
  }
}
```

---

### 13.2 Search Profiles
**Endpoint:** `GET /search/profiles?query={query}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Search profiles only

**Response:** `200 OK` (Paginated profiles)

---

### 13.3 Search Posts
**Endpoint:** `GET /search/posts?query={query}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Search posts only

**Response:** `200 OK` (Paginated posts)

---

### 13.4 Search Reels
**Endpoint:** `GET /search/reels?query={query}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Search reels only

**Response:** `200 OK` (Paginated reels)

---

## 14. Post APIs

### 14.1 Create Post
**Endpoint:** `POST /posts`  
**Authentication:** Required  
**Description:** Create new social media post

**Request Body:**
```json
{
  "userId": 1,
  "caption": "string (max 2200 chars, required)",
  "mediaUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "tags": ["education", "crowdfunding"],
  "location": "string (optional)",
  "isPublic": true
}
```

**Response:** `201 Created`
```json
{
  "id": "post123",
  "userId": 1,
  "username": "johndoe",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "caption": "Excited to launch our new campaign! 🎉",
  "mediaUrls": [
    "https://example.com/image1.jpg"
  ],
  "tags": ["education", "crowdfunding"],
  "location": "Mumbai, India",
  "isPublic": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "likesCount": 0,
  "commentsCount": 0,
  "isLiked": false
}
```

---

### 14.2 Get Post by ID
**Endpoint:** `GET /posts/{postId}?userId={userId}`  
**Authentication:** Optional  
**Description:** Get single post details

**Query Parameters:**
- `userId` (optional): To check if user liked the post

**Response:** `200 OK` (same as Create)

---

### 14.3 Update Post
**Endpoint:** `PUT /posts/{postId}`  
**Authentication:** Required (post owner)  
**Description:** Update post

**Request Body:** Same as Create

**Response:** `200 OK`

---

### 14.4 Delete Post
**Endpoint:** `DELETE /posts/{postId}?userId={userId}`  
**Authentication:** Required (post owner)  
**Description:** Delete post

**Response:** `204 No Content`

---

### 14.5 Get User Posts
**Endpoint:** `GET /posts/user/{userId}?currentUserId={currentUserId}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all posts from a user

**Query Parameters:**
- `currentUserId` (optional): To check liked status
- `page`, `size`: Pagination

**Response:** `200 OK` (Paginated list)

---

### 14.6 Get Feed Posts
**Endpoint:** `GET /posts/feed?userId={userId}&followingIds={id1}&followingIds={id2}&page={page}&size={size}`  
**Authentication:** Required  
**Description:** Get posts from followed users (feed)

**Query Parameters:**
- `userId` (required): Current user ID
- `followingIds` (required, multiple): IDs of followed users
- `page`, `size`: Pagination

**Response:** `200 OK` (Paginated list)

---

## 15. Reel APIs

### 15.1 Create Reel
**Endpoint:** `POST /reels`  
**Authentication:** Required  
**Description:** Upload new video reel

**Request Body:**
```json
{
  "userId": 1,
  "caption": "string (max 2200 chars, required)",
  "videoUrl": "string (URL, required)",
  "thumbnailUrl": "string (URL, optional)",
  "duration": 30,
  "tags": ["campaign", "update"],
  "aspectRatio": "9:16",
  "isPublic": true
}
```

**Response:** `201 Created`
```json
{
  "id": "reel123",
  "userId": 1,
  "username": "johndoe",
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "caption": "Campaign update! 🎥 #crowdfunding",
  "videoUrl": "https://example.com/video.mp4",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "duration": 30,
  "aspectRatio": "9:16",
  "tags": ["campaign", "update"],
  "viewCount": 0,
  "isPublic": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "likesCount": 0,
  "commentsCount": 0,
  "sharesCount": 0,
  "isLiked": false
}
```

---

### 15.2 Get Reel by ID
**Endpoint:** `GET /reels/{reelId}?userId={userId}`  
**Authentication:** Optional  
**Description:** Get single reel

**Query Parameters:**
- `userId` (optional): To check if user liked the reel

**Response:** `200 OK` (same as Create)

---

### 15.3 Update Reel
**Endpoint:** `PUT /reels/{reelId}`  
**Authentication:** Required (reel owner)  
**Description:** Update reel details

**Request Body:** Same as Create (except videoUrl)

**Response:** `200 OK`

---

### 15.4 Delete Reel
**Endpoint:** `DELETE /reels/{reelId}?userId={userId}`  
**Authentication:** Required (reel owner)  
**Description:** Delete reel

**Response:** `204 No Content`

---

### 15.5 Get User Reels
**Endpoint:** `GET /reels/user/{userId}?currentUserId={currentUserId}&page={page}&size={size}`  
**Authentication:** Optional  
**Description:** Get all reels from a user

**Query Parameters:**
- `currentUserId` (optional): To check liked status
- `page`, `size`: Pagination

**Response:** `200 OK` (Paginated list)

---

## 16. Payment APIs (TO BE IMPLEMENTED)

### 16.1 Initiate Payment
**Endpoint:** `POST /payments/initiate`  
**Authentication:** Required  
**Description:** Start payment process

**Request Body:**
```json
{
  "campaignId": 1,
  "donorId": 1,
  "amount": 5000.00,
  "currency": "INR",
  "paymentMethod": "UPI",
  "isAnonymous": false,
  "message": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "paymentId": "pay_123456",
  "orderId": "order_789",
  "amount": 5000.00,
  "currency": "INR",
  "status": "PENDING",
  "redirectUrl": "https://payment-gateway.com/pay/..."
}
```

---

### 16.2 Generate UPI QR Code
**Endpoint:** `POST /payments/upi/qr-code`  
**Authentication:** Required  
**Description:** Generate UPI QR code for payment

**Request Body:**
```json
{
  "amount": 5000.00,
  "campaignId": 1,
  "donorId": 1
}
```

**Response:** `200 OK`
```json
{
  "qrCodeImage": "base64_encoded_image",
  "upiLink": "upi://pay?pa=merchant@upi&am=5000...",
  "transactionId": "TXN123456",
  "expiresAt": "2024-01-15T11:00:00"
}
```

---

### 16.3 Verify UPI Payment
**Endpoint:** `GET /payments/upi/verify/{transactionId}`  
**Authentication:** Required  
**Description:** Check UPI payment status

**Response:** `200 OK`
```json
{
  "transactionId": "TXN123456",
  "status": "SUCCESS",
  "amount": 5000.00,
  "paidAt": "2024-01-15T10:35:00"
}
```

---

### 16.4 Process Card Payment
**Endpoint:** `POST /payments/card/process`  
**Authentication:** Required  
**Description:** Process card payment

**Request Body:**
```json
{
  "cardNumber": "4111111111111111",
  "cardHolder": "JOHN DOE",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cvv": "123",
  "amount": 5000.00,
  "campaignId": 1,
  "donorId": 1,
  "saveCard": false
}
```

**Response:** `200 OK`
```json
{
  "paymentId": "pay_123456",
  "status": "SUCCESS",
  "transactionId": "TXN789",
  "message": "Payment successful"
}
```

---

### 16.5 Get Supported Banks
**Endpoint:** `GET /payments/netbanking/banks`  
**Authentication:** Optional  
**Description:** Get list of supported banks for net banking

**Response:** `200 OK`
```json
[
  {
    "code": "SBI",
    "name": "State Bank of India",
    "icon": "https://example.com/banks/sbi.png"
  },
  {
    "code": "HDFC",
    "name": "HDFC Bank",
    "icon": "https://example.com/banks/hdfc.png"
  }
]
```

---

### 16.6 Initiate Net Banking
**Endpoint:** `POST /payments/netbanking/initiate`  
**Authentication:** Required  
**Description:** Start net banking payment

**Request Body:**
```json
{
  "bankCode": "SBI",
  "amount": 5000.00,
  "campaignId": 1,
  "donorId": 1
}
```

**Response:** `200 OK`
```json
{
  "paymentId": "pay_123456",
  "redirectUrl": "https://netbanking.sbi.co.in/...",
  "orderId": "order_789"
}
```

---

### 16.7 Get Supported Wallets
**Endpoint:** `GET /payments/wallet/supported`  
**Authentication:** Optional  
**Description:** Get list of supported digital wallets

**Response:** `200 OK`
```json
[
  {
    "code": "PAYTM",
    "name": "Paytm",
    "icon": "https://example.com/wallets/paytm.png"
  },
  {
    "code": "PHONEPE",
    "name": "PhonePe",
    "icon": "https://example.com/wallets/phonepe.png"
  }
]
```

---

### 16.8 Initiate Wallet Payment
**Endpoint:** `POST /payments/wallet/initiate`  
**Authentication:** Required  
**Description:** Start wallet payment

**Request Body:**
```json
{
  "walletType": "PAYTM",
  "amount": 5000.00,
  "campaignId": 1,
  "donorId": 1
}
```

**Response:** `200 OK`
```json
{
  "paymentId": "pay_123456",
  "redirectUrl": "paytm://pay/...",
  "deepLink": "paytm://...",
  "orderId": "order_789"
}
```

---

### 16.9 Verify Payment
**Endpoint:** `GET /payments/verify/{paymentId}`  
**Authentication:** Required  
**Description:** Verify any payment status

**Response:** `200 OK`
```json
{
  "paymentId": "pay_123456",
  "status": "SUCCESS",
  "amount": 5000.00,
  "paymentMethod": "UPI",
  "transactionId": "TXN123456",
  "paidAt": "2024-01-15T10:35:00"
}
```

---

### 16.10 Get Payment Details
**Endpoint:** `GET /payments/{paymentId}`  
**Authentication:** Required  
**Description:** Get complete payment details

**Response:** `200 OK`
```json
{
  "id": "pay_123456",
  "campaignId": 1,
  "donorId": 1,
  "amount": 5000.00,
  "currency": "INR",
  "paymentMethod": "UPI",
  "status": "SUCCESS",
  "transactionId": "TXN123456",
  "createdAt": "2024-01-15T10:30:00",
  "paidAt": "2024-01-15T10:35:00"
}
```

---

### 16.11 Request Refund
**Endpoint:** `POST /payments/{paymentId}/refund`  
**Authentication:** Required (admin)  
**Description:** Process payment refund

**Request Body:**
```json
{
  "reason": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "refundId": "refund_123",
  "paymentId": "pay_123456",
  "amount": 5000.00,
  "status": "PENDING",
  "initiatedAt": "2024-01-15T10:40:00"
}
```

---

### 16.12 Get Refund Status
**Endpoint:** `GET /payments/refund/{refundId}/status`  
**Authentication:** Required  
**Description:** Check refund status

**Response:** `200 OK`
```json
{
  "refundId": "refund_123",
  "status": "COMPLETED",
  "amount": 5000.00,
  "completedAt": "2024-01-16T10:00:00"
}
```

---

### 16.13 Get User Payment History
**Endpoint:** `GET /payments/user/{userId}/history?page={page}&size={size}`  
**Authentication:** Required (own history)  
**Description:** Get payment history for user

**Response:** `200 OK` (Paginated list of payments)

---

### 16.14 Get Campaign Payment History
**Endpoint:** `GET /payments/campaign/{campaignId}/history?page={page}&size={size}`  
**Authentication:** Required (campaign creator)  
**Description:** Get all payments for campaign

**Response:** `200 OK` (Paginated list of payments)

---

## 📚 Common Response Structures

### Paginated Response
```json
{
  "content": [ /* Array of objects */ ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    }
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "numberOfElements": 20,
  "empty": false
}
```

---

### Error Response
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/campaigns",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 5 and 200 characters"
    }
  ]
}
```

---

## 🔐 Authentication Header

For all authenticated endpoints, include JWT token in header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## 🚀 Getting Started

### 1. Base URL
```
Development: http://localhost:8080/api/v1
Production: https://api.yourapp.com/api/v1
```

### 2. Authentication Flow
```
1. POST /auth/register → Create account
2. POST /auth/login → Get JWT token
3. Use token in Authorization header for protected endpoints
4. POST /auth/refresh → Refresh expired token
5. POST /auth/logout → Invalidate token
```

### 3. Testing with Postman/cURL

**Example - Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

**Example - Get Campaigns:**
```bash
curl -X GET "http://localhost:8080/api/v1/campaigns/active?page=0&size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Notes for Replit AI

### Priority APIs to Implement:
1. **Payment APIs** (Section 16) - Critical for MVP
2. **File Upload** - For images/videos (if not using URLs)
3. **Real-time Notifications** - WebSocket support
4. **Analytics** - Campaign/user statistics

### Frontend Integration Points:
- All service files in `src/services/` are configured for these endpoints
- Update `VITE_API_URL` in `.env.local` to point to your backend
- JWT token is automatically added to requests via axios interceptor
- Error handling is implemented in service files

### Database Entities Needed:
- User, Profile, Campaign, Donation, Withdrawal
- BankAccount, Comment, Like, Follow, Notification
- Report, Post, Reel, CampaignUpdate, Payment

### Security Considerations:
- JWT token expiration: 24 hours (recommended)
- Refresh token: 7 days (recommended)
- CORS: Enable for frontend origin
- Rate limiting: 100 requests/minute per user
- Input validation: All DTOs have validation annotations

---

**END OF DOCUMENTATION**

This documentation covers 100+ endpoints across 16 API modules. Use this as reference to complete any remaining frontend configurations.