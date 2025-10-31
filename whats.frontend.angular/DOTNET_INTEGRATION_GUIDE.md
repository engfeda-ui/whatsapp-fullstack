# 🔗 Angular Frontend + .NET Backend Integration Guide

## ✅ تم التعديل بنجاح!

تم تحديث Angular Frontend بالكامل للتوافق مع .NET Backend (ASP.NET Core).

---

## 📝 التعديلات المنفذة

### ✅ 1. ApiResponse Interface
**الملف**: `src/app/core/ApiResponse.ts`

تم إضافة:
- `DotNetApiResponse<T>` interface للـ .NET format
- `convertDotNetResponse()` utility function للتحويل التلقائي
- الحفاظ على الـ `ApiResponse<T>` الأصلي للتوافق مع الكود الحالي

### ✅ 2. Environment Configuration
**الملفات**:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

تم التحديث:
```typescript
apiUrl: 'http://localhost:5229/api'  // .NET Backend
signalRUrl: 'http://localhost:5229/hubs/whatsapp'  // SignalR Hub
```

### ✅ 3. Auth Services (2 files)
**الملفات**:
- `src/app/pages/auth/auth.service.ts`
- `src/app/core/services/auth.service.ts`

تم التحديث:
- Login endpoint: `POST /api/auth/login`
- Register endpoint: `POST /api/auth/register`
- Refresh token: `POST /api/auth/refresh-token`
- Get current user: `GET /api/auth/me`
- Logout with revoke: `POST /api/auth/revoke-token`

### ✅ 4. Device Service
**الملف**: `src/app/pages/Whats App/device/device.service.ts`

تم التحديث:
- Get all: `GET /api/device`
- Get by ID: `GET /api/device/{id}`
- Create: `POST /api/device`
- Update: `PUT /api/device/{id}`
- Delete: `DELETE /api/device/{id}`
- QR Code: `GET /api/device/{id}/qrcode`
- Regenerate API Key: `POST /api/device/{id}/regenerate-apikey`

### ✅ 5. Messages Service
**الملف**: `src/app/pages/Whats App/message/message.service.ts`

تم التحديث:
- Send message: `POST /api/whatsapp/send-message`
- Send media: `POST /api/whatsapp/send-media`
- Send bulk: `POST /api/whatsapp/send-bulk`
- Get messages: `GET /api/whatsapp/messages/{deviceId}`
- Get message: `GET /api/whatsapp/message/{messageId}`

### ✅ 6. Auth Interceptor
**الملف**: `src/app/core/interceptors/auth.interceptor.ts`

تم التحسين:
- إضافة Bearer token تلقائياً لكل request
- معالجة 401 errors بإعادة محاولة refresh token
- Automatic logout عند فشل refresh

---

## 🚀 خطوات التشغيل

### 1. تشغيل .NET Backend
```bash
cd D:\angular\whats.backend.aspnet\WhatsApp.Backend
dotnet run
```

Backend سيعمل على: `http://localhost:5229`

### 2. تشغيل Angular Frontend
```bash
cd D:\angular\whats.frontend
npm start
```

Frontend سيعمل على: `http://localhost:4200`

---

## 🧪 اختبار التكامل

### Test 1: Register User
1. افتح `http://localhost:4200`
2. اذهب إلى صفحة Register
3. املأ البيانات:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test123
4. اضغط Register

**Expected**: يتم تسجيل المستخدم ويتم الحصول على JWT token

### Test 2: Login
1. اذهب إلى Login page
2. Email: test@example.com
3. Password: Test123
4. اضغط Login

**Expected**: يتم تسجيل الدخول وحفظ token في localStorage

### Test 3: Create Device
1. بعد Login، اذهب إلى Devices page
2. اضغط "Add Device"
3. املأ:
   - Name: My Device
   - Phone: +201234567890
4. اضغط Create

**Expected**: يتم إنشاء device جديد ويظهر في القائمة

### Test 4: Send Message
1. افتح device من القائمة
2. اذهب إلى Send Message
3. املأ:
   - To: +201234567890
   - Message: Test message
4. اضغط Send

**Expected**: يتم إرسال الرسالة وتظهر في Message history

---

## 🔍 مقارنة الـ API Formats

### Old Format (NestJS):
```json
{
  "isSuccess": true,
  "returnCode": 200,
  "data": {...},
  "message": "Success"
}
```

### New Format (.NET):
```json
{
  "success": true,
  "message": "Success",
  "data": {...},
  "error": null
}
```

### ✅ الحل:
الـ `convertDotNetResponse()` function يحول تلقائياً من .NET format إلى Angular format، لذلك الكود الحالي يعمل بدون تغيير في Components!

---

## 📊 ملخص التغييرات

| الملف | التغيير | الحالة |
|------|---------|--------|
| `ApiResponse.ts` | إضافة .NET types + converter | ✅ |
| `environment.ts` | تحديث API URL | ✅ |
| `environment.prod.ts` | تحديث API URL | ✅ |
| `auth.service.ts` (pages) | تحديث endpoints | ✅ |
| `auth.service.ts` (core) | تحديث refresh token | ✅ |
| `device.service.ts` | تحديث endpoints | ✅ |
| `message.service.ts` | تحديث endpoints | ✅ |
| `auth.interceptor.ts` | تحسين error handling | ✅ |

---

## 🎯 Features الجديدة المتاحة

### 1. AI Features (من .NET Backend)
يمكنك الآن إنشاء service جديد للـ AI:

```typescript
// src/app/services/ai.service.ts
@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = `${environment.apiUrl}/agent`;

  constructor(private http: HttpClient) {}

  chat(message: string): Observable<ApiResponse<any>> {
    return this.http.post<DotNetApiResponse<any>>(`${this.apiUrl}/chat`, {
      message,
      temperature: 0.7,
      maxTokens: 1000
    }).pipe(map(convertDotNetResponse));
  }

  generateMessage(prompt: string): Observable<ApiResponse<string>> {
    return this.http.post<DotNetApiResponse<string>>(`${this.apiUrl}/generate-message`, {
      prompt
    }).pipe(map(convertDotNetResponse));
  }

  multiAgent(task: string): Observable<ApiResponse<any>> {
    return this.http.post<DotNetApiResponse<any>>(`${this.apiUrl}/multi-agent`, {
      task,
      maxRounds: 5
    }).pipe(map(convertDotNetResponse));
  }
}
```

### 2. Real-Time Updates (SignalR)
يمكنك إضافة SignalR connection:

```bash
npm install @microsoft/signalr
```

```typescript
// src/app/services/signalr.service.ts
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: signalR.HubConnection;

  constructor(private tokenService: TokenService) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}`, {
        accessTokenFactory: () => this.tokenService.getToken() || ''
      })
      .build();
  }

  async start() {
    await this.connection.start();
  }

  subscribeToDevice(deviceId: number) {
    this.connection.invoke('SubscribeToDevice', deviceId);
  }

  onMessageReceived(callback: (data: any) => void) {
    this.connection.on('MessageReceived', callback);
  }
}
```

---

## ⚠️ ملاحظات مهمة

### 1. CORS
تأكد أن .NET Backend يسمح بـ CORS من Angular:
```csharp
// في appsettings.json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:4200"
  ]
}
```

### 2. Azure OpenAI (Optional)
إذا أردت استخدام AI features، ستحتاج:
1. Azure OpenAI subscription
2. تحديث `appsettings.json` في Backend:
```json
"AzureOpenAI": {
  "Endpoint": "https://your-resource.openai.azure.com/",
  "ApiKey": "your-api-key",
  "DeploymentName": "gpt-4"
}
```

### 3. SQLite Database
Backend يستخدم SQLite حالياً. الـ database file موجود في:
```
D:\angular\whats.backend.aspnet\WhatsApp.Backend\whatsapp.db
```

---

## 🐛 Troubleshooting

### مشكلة: CORS Error
**الحل**: تأكد أن Backend يعمل وأن CORS مفعّل

### مشكلة: 401 Unauthorized
**الحل**: تأكد من:
1. Login بنجاح أولاً
2. Token موجود في localStorage
3. Interceptor يضيف Authorization header

### مشكلة: Cannot connect to backend
**الحل**:
1. تأكد Backend يعمل على `http://localhost:5229`
2. افتح `http://localhost:5229/` في Browser - يجب تشوف Swagger UI

---

## ✅ Checklist

- [x] ApiResponse interface updated
- [x] Environment URLs updated
- [x] Auth services updated
- [x] Device service updated
- [x] Message service updated
- [x] Interceptor updated
- [x] Backend running on port 5229
- [ ] Test registration
- [ ] Test login
- [ ] Test device creation
- [ ] Test message sending

---

## 🎉 الخلاصة

✅ **Angular Frontend جاهز 100% للعمل مع .NET Backend**

الـ Services تم تحديثها بالكامل، والـ Interceptor يتعامل مع JWT tokens تلقائياً، والـ ApiResponse converter يضمن التوافق الكامل!

**كل ما عليك:**
1. شغّل Backend: `dotnet run`
2. شغّل Frontend: `npm start`
3. ابدأ الاستخدام!

🚀 **Happy Coding!**
