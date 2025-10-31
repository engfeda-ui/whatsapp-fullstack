# 📂 دليل استخدام VS Code Workspace

## 🎯 ما هو الـ Workspace؟

Workspace هو ملف يجمع عدة مشاريع (Frontend + Backend) في نافذة VS Code واحدة مع:
- ✅ إعدادات مخصصة لكل مشروع
- ✅ Tasks جاهزة لتشغيل المشاريع
- ✅ Debug configurations
- ✅ Extensions موصى بها

---

## 🚀 كيفية فتح الـ Workspace

### الطريقة 1: من File Explorer
1. اذهب إلى: `D:\angular`
2. ابحث عن ملف: **`whatsapp-fullstack.code-workspace`**
3. اضغط Double-click عليه

### الطريقة 2: من VS Code
1. افتح VS Code
2. File → Open Workspace from File
3. اختر: `D:\angular\whatsapp-fullstack.code-workspace`

### الطريقة 3: من Command Line
```bash
cd D:\angular
code whatsapp-fullstack.code-workspace
```

---

## 📁 هيكل الـ Workspace

عند فتح الـ Workspace، سترى في الـ Explorer:

```
📂 🎨 Frontend (Angular)
   ├── src/
   ├── package.json
   └── angular.json

📂 ⚙️ Backend (.NET)
   ├── Controllers/
   ├── Services/
   ├── Models/
   ├── Program.cs
   └── WhatsApp.Backend.csproj
```

---

## ⚡ المهام الجاهزة (Tasks)

يمكنك تشغيل المهام من: **Terminal → Run Task**

### مهام التشغيل:
1. **🚀 Run Frontend (Angular)**
   - يشغل Angular على http://localhost:4200
   - يفتح terminal مخصص للـ Frontend

2. **⚙️ Run Backend (.NET)**
   - يشغل .NET على http://localhost:5229
   - يفتح terminal مخصص للـ Backend

3. **🚀 Run Both (Frontend + Backend)**
   - يشغل الإثنين معاً في نفس الوقت
   - **هذا الأفضل!** 👈

### مهام البناء (Build):
4. **🔨 Build Frontend**
   - يبني Angular للإنتاج

5. **🔨 Build Backend**
   - يبني .NET Backend

6. **🔨 Build Both**
   - يبني الإثنين بالترتيب

### مهام الاختبار:
7. **🧪 Test Frontend**
   - يشغل Angular tests

8. **🧪 Test Backend**
   - يشغل .NET tests

### مهام التثبيت:
9. **📦 Install Frontend Dependencies**
   - npm install للـ Frontend

10. **📦 Restore Backend Packages**
    - dotnet restore للـ Backend

---

## 🐛 Debug (التصحيح)

يمكنك تصحيح الأخطاء من: **Run and Debug (Ctrl+Shift+D)**

### خيارات Debug المتاحة:

#### 1. 🎨 Debug Frontend (Chrome)
- يفتح Chrome ويربطه بـ VS Code
- يمكنك وضع Breakpoints في TypeScript
- يشغل Frontend تلقائياً

#### 2. ⚙️ Debug Backend (.NET)
- يشغل Backend في Debug mode
- يمكنك وضع Breakpoints في C#
- يفتح Swagger تلقائياً

#### 3. 🚀 Debug Both (Compound)
- **الأفضل!** يصحح Frontend + Backend معاً
- Breakpoints تعمل في الإثنين
- مثالي لتتبع API calls

---

## 🎨 الإعدادات المضبوطة مسبقاً

### للـ Angular/TypeScript:
- ✅ Auto Save بعد ثانية
- ✅ Format on Save
- ✅ Auto Organize Imports
- ✅ Prettier formatter
- ✅ Tab size = 2 spaces

### للـ C#:
- ✅ Format on Save
- ✅ Auto using statements
- ✅ EditorConfig support
- ✅ Roslyn Analyzers
- ✅ Tab size = 4 spaces

### عام:
- ✅ Auto Save enabled
- ✅ Terminal tabs
- ✅ Exclude node_modules, bin, obj من Search

---

## 🔌 Extensions الموصى بها

عند فتح الـ Workspace لأول مرة، سيسألك VS Code:
**"Do you want to install the recommended extensions?"**

اختر **"Install All"** لتثبيت:

### Angular:
- Angular Language Service
- Angular Schematics
- Angular Snippets

### C#:
- C# Dev Kit
- C# Extensions

### عام:
- GitLens
- Prettier
- ESLint
- Path Intellisense
- Spell Checker

---

## 💡 نصائح الاستخدام

### 1. تشغيل سريع للمشروع:
```
1. Ctrl+Shift+P
2. اكتب: "Run Task"
3. اختر: "🚀 Run Both (Frontend + Backend)"
4. انتظر قليلاً... Done! ✅
```

### 2. فتح Terminal لكل مشروع:
```
- Terminal → Split Terminal
- في Terminal الأول: cd للـ Backend
- في Terminal الثاني: cd للـ Frontend
```

### 3. البحث في مشروع معين:
```
- Ctrl+Shift+F
- اكتب بحثك
- في "files to include" اكتب:
  - Frontend: **/whats.frontend/**
  - Backend: **/WhatsApp.Backend/**
```

### 4. Git في الـ Workspace:
```
- Source Control (Ctrl+Shift+G)
- سترى الـ repos الإثنين
- يمكنك commit لكل واحد منفصل
```

---

## 🎯 Workflow الموصى به

### صباح كل يوم:
1. **افتح الـ Workspace**
   ```
   code whatsapp-fullstack.code-workspace
   ```

2. **شغل الخوادم**
   ```
   Terminal → Run Task → "Run Both"
   ```

3. **ابدأ التطوير!**
   - Frontend: http://localhost:4200
   - Backend: http://localhost:5229
   - Swagger: http://localhost:5229/swagger

### عند تطوير feature جديدة:
1. **اكتب Backend API أولاً**
   - افتح Controller
   - أضف endpoint
   - اختبر في Swagger

2. **اكتب Frontend**
   - افتح Service
   - أضف method
   - استخدمها في Component

3. **اختبر Integration**
   - Debug Both معاً
   - ضع Breakpoints في الإثنين
   - تتبع الـ API call

### قبل Commit:
1. **Build Both**
   ```
   Terminal → Run Task → "Build Both"
   ```

2. **تأكد من النجاح**
   - Frontend: لا يوجد TypeScript errors
   - Backend: لا يوجد C# errors

3. **Commit**
   ```
   Source Control → Commit للإثنين
   ```

---

## ⌨️ Keyboard Shortcuts مفيدة

### عام:
- **Ctrl+P**: Quick file open
- **Ctrl+Shift+P**: Command Palette
- **Ctrl+`**: Toggle Terminal
- **Ctrl+B**: Toggle Sidebar

### Navigation:
- **Ctrl+Tab**: Switch between open files
- **Alt+←/→**: Go back/forward
- **F12**: Go to Definition
- **Shift+F12**: Find All References

### Editing:
- **Ctrl+D**: Select next occurrence
- **Alt+↑/↓**: Move line up/down
- **Ctrl+/**: Toggle comment
- **Shift+Alt+F**: Format document

### Debug:
- **F5**: Start debugging
- **F9**: Toggle breakpoint
- **F10**: Step over
- **F11**: Step into
- **Shift+F5**: Stop debugging

---

## 🔧 تخصيص الـ Workspace

### إضافة مشروع ثالث:
إذا أردت إضافة مشروع آخر (مثل Mobile App):

1. افتح `whatsapp-fullstack.code-workspace`
2. أضف في `folders`:
```json
{
  "name": "📱 Mobile (React Native)",
  "path": "angular/whats.mobile"
}
```

### تغيير الإعدادات:
1. افتح Command Palette (Ctrl+Shift+P)
2. اكتب: "Preferences: Open Workspace Settings (JSON)"
3. عدل ما تريد

### إضافة Task جديد:
1. Terminal → Configure Tasks
2. أضف task جديد في `tasks`

---

## 🐛 حل المشاكل

### المشكلة: Extensions لا تعمل
**الحل:**
1. Ctrl+Shift+P
2. "Developer: Reload Window"

### المشكلة: Task لا يعمل
**الحل:**
1. تأكد من paths صحيحة
2. تأكد من npm/dotnet installed
3. شغل Task من Terminal يدوياً لترى الخطأ

### المشكلة: Debug لا يبدأ
**الحل:**
1. تأكد من Backend مبني (Build)
2. تأكد من Chrome installed
3. تأكد من ports 4200 و 5229 متاحة

---

## 📊 مقارنة: Workspace vs فتح مشاريع منفصلة

| الميزة | Workspace | مشاريع منفصلة |
|--------|-----------|---------------|
| عدد النوافذ | نافذة واحدة ✅ | نافذتين ❌ |
| Tasks مشتركة | ✅ | ❌ |
| Debug معاً | ✅ | ❌ |
| Settings موحدة | ✅ | ❌ |
| Search في الإثنين | ✅ | ❌ |
| Git للإثنين | ✅ | ❌ |
| الذاكرة المستخدمة | أقل ✅ | أكثر ❌ |

**النتيجة:** Workspace أفضل بكثير! 🏆

---

## 🎊 الخلاصة

### ✅ مميزات الـ Workspace:
- نافذة واحدة للمشروعين
- Tasks جاهزة للتشغيل
- Debug لـ Frontend + Backend معاً
- Settings مخصصة لكل مشروع
- Extensions موصى بها
- Git management للإثنين

### 🚀 البداية السريعة:
1. افتح: `whatsapp-fullstack.code-workspace`
2. Install Recommended Extensions
3. Run Task: "Run Both"
4. ابدأ التطوير!

---

## 📖 موارد إضافية

- **VS Code Workspaces**: https://code.visualstudio.com/docs/editor/multi-root-workspaces
- **Tasks**: https://code.visualstudio.com/docs/editor/tasks
- **Debugging**: https://code.visualstudio.com/docs/editor/debugging

---

**استمتع بالتطوير! 🎉**
