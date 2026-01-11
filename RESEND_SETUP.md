# Resend Email Setup Guide

This backend now uses [Resend](https://resend.com) for sending emails instead of SMTP.

## Why Resend?

- ✅ Simple API-based email service
- ✅ No SMTP configuration needed
- ✅ Better deliverability
- ✅ Free tier: 3,000 emails/month
- ✅ Easy domain verification
- ✅ Built for developers

## Setup Steps

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Go to [API Keys](https://resend.com/api-keys) in your Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "Bus Booking App")
4. Copy the API key (starts with `re_`)

### 3. Verify Your Domain (Recommended)

1. Go to [Domains](https://resend.com/domains) in your Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain's DNS settings
5. Wait for verification (usually a few minutes)

**Note**: You can also use Resend's test domain for development, but emails will be limited.

### 4. Configure Environment Variables

Add these to your `.env` file:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_your_api_key_here

# From Email Address - The sender email that appears in all emails
# 
# For Testing/Development (No domain verification needed):
RESEND_FROM_EMAIL=Bus Booking App <onboarding@resend.dev>
#
# For Production (Requires domain verification):
# RESEND_FROM_EMAIL=Bus Booking App <noreply@yourdomain.com>
# OR just: RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**What is RESEND_FROM_EMAIL?**
- This is the email address that will appear as the "From" sender in all emails sent by your app
- For **testing/development**: Use `onboarding@resend.dev` (no setup needed)
- For **production**: Use your own verified domain like `noreply@yourdomain.com`

### 5. Install Dependencies

```bash
cd backend
npm install
```

This will install the `resend` package (replaces `nodemailer`).

## Testing

1. Start your backend server
2. You should see: `✅ Resend email service initialized`
3. Try registering a new user - you should receive an OTP email

## Email Types Sent

The app sends these emails via Resend:

1. **OTP Verification** - When users register or request OTP
2. **Password Reset** - When users request password reset
3. **Booking Confirmation** - When a booking is successfully created
4. **Booking Cancellation** - When a booking is cancelled

## Troubleshooting

### "Resend API key not configured"
- Make sure `RESEND_API_KEY` is set in your `.env` file
- Restart your server after adding the environment variable

### "Invalid API key"
- Verify your API key is correct
- Make sure there are no extra spaces or quotes in your `.env` file

### "Domain not verified"
- Verify your domain in Resend dashboard
- For testing, you can use Resend's test domain temporarily

### Emails not sending
- Check Resend dashboard for error logs
- Verify your `RESEND_FROM_EMAIL` format is correct
- Make sure the recipient email is valid

## Free Tier Limits

- **3,000 emails/month** on the free tier
- Upgrade to paid plans for more volume
- See [Resend Pricing](https://resend.com/pricing) for details

## Migration from Nodemailer

If you were using Nodemailer before:

1. ✅ Remove `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` from `.env`
2. ✅ Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to `.env`
3. ✅ Run `npm install` to get the new `resend` package
4. ✅ Restart your server

The code has been automatically updated - no code changes needed!
