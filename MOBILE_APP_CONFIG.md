# Mobile App Configuration Guide

## Frontend URL for Mobile Apps

**Short answer: No, mobile apps don't need a traditional frontend URL.**

### Why Mobile Apps Are Different

1. **No CORS Restrictions**: Mobile apps don't have browser-based CORS restrictions
2. **Direct API Calls**: Flutter apps make direct HTTP requests to your backend
3. **No Web Domain**: Mobile apps don't have a web URL like `https://yourapp.com`

### CORS Configuration

The backend is configured to allow all origins (`*`) which is fine for mobile apps:

```javascript
app.use(cors({
  origin: '*', // Allows all origins (perfect for mobile)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Environment Variable: `FRONTEND_URL`

For a **mobile app**, you can:
- Set `FRONTEND_URL=*` (allows all origins)
- Omit it entirely (defaults to `*`)
- Leave it in `.env` with `*`

**For production**, if you want to restrict access:
- You can specify allowed IP addresses or domains
- Or keep it as `*` since mobile apps need flexibility

### Email Links (Password Reset, OTP)

When sending emails with links (password reset, etc.), the app uses:

1. **Deep Links** (preferred for mobile):
   ```
   busbookingapp://reset-password?token=xxx
   ```

2. **Web URL** (if you have a web version):
   ```
   https://yourapp.com/reset-password?token=xxx
   ```

### Flutter App API Configuration

In your Flutter app (`lib/config/api_config.dart`), you set:

```dart
static const String baseUrl = 'http://localhost:3000/api';
```

**Important URLs for different platforms:**
- **Android Emulator**: `http://10.0.2.2:3000/api`
- **iOS Simulator**: `http://localhost:3000/api`
- **Physical Device**: `http://YOUR_COMPUTER_IP:3000/api`
- **Production**: `https://your-backend-domain.com/api`

### Deep Links Setup (Optional)

If you want to handle password reset links in your mobile app, set up deep links:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="busbookingapp" />
</intent-filter>
```

**iOS** (`ios/Runner/Info.plist`):
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>busbookingapp</string>
        </array>
    </dict>
</array>
```

### Summary

- ✅ **No frontend URL needed** for mobile apps
- ✅ Set `FRONTEND_URL=*` or omit it
- ✅ CORS allows all origins (works for mobile)
- ✅ API calls go directly from Flutter app to backend
- ✅ Email links can use deep links: `busbookingapp://...`

The backend is already configured correctly for mobile app usage!
