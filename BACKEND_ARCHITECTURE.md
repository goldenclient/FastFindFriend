
# مستندات معماری بک‌اند (ASP.NET Core + SQL Server)

این سند شامل طراحی دیتابیس، مدل‌های انتیتی فریم‌ورک و لیست API‌های مورد نیاز برای اتصال فرانت‌اند پروژه "3F App" به بک‌اند است.

---

## 1. طراحی دیتابیس (SQL Server Scripts)

این اسکریپت‌ها جداول مورد نیاز را بر اساس `types.ts` موجود در فرانت‌اند می‌سازند.

```sql
-- ایجاد دیتابیس
CREATE DATABASE FastFindFriendDB;
GO
USE FastFindFriendDB;
GO

-- جدول کاربران
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Mobile NVARCHAR(15) NOT NULL UNIQUE, -- برای لاگین
    OtpCode NVARCHAR(6) NULL, -- کد تایید موقت
    OtpExpiry DATETIME NULL,
    Age INT NOT NULL,
    Gender NVARCHAR(20) NOT NULL, -- Enum: Male, Female, Other
    Location NVARCHAR(200) NOT NULL,
    Occupation NVARCHAR(100) NULL,
    Bio NVARCHAR(MAX) NULL,
    PhotoUrl NVARCHAR(MAX) NULL, -- عکس پروفایل اصلی
    MaritalStatus NVARCHAR(50) NOT NULL,
    Height INT NOT NULL, -- cm
    Weight INT NOT NULL, -- kg
    FavoriteSport NVARCHAR(100) NULL,
    PartnerPreferences NVARCHAR(MAX) NULL,
    IsOnline BIT DEFAULT 0,
    LastActive DATETIME DEFAULT GETDATE(),
    Latitude FLOAT NULL, -- برای محاسبه فاصله
    Longitude FLOAT NULL, -- برای محاسبه فاصله
    IsPremium BIT DEFAULT 0,
    IsGhostMode BIT DEFAULT 0,
    StoryUrl NVARCHAR(MAX) NULL,
    StoryCreatedAt DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- تنظیمات کاربر (یک به یک با Users)
CREATE TABLE UserSettings (
    UserId UNIQUEIDENTIFIER PRIMARY KEY REFERENCES Users(Id),
    NewLikeNotification BIT DEFAULT 1,
    NewMessageNotification BIT DEFAULT 1,
    BiometricLogin BIT DEFAULT 0,
    ProfileViewNotification BIT DEFAULT 1
);

-- گالری تصاویر کاربر (یک به چند)
CREATE TABLE UserGalleryImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    ImageUrl NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- پیام‌ها (چت)
CREATE TABLE Messages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SenderId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    ReceiverId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    Text NVARCHAR(MAX) NULL,
    ImageUrl NVARCHAR(MAX) NULL,
    IsRead BIT DEFAULT 0,
    Timestamp DATETIME DEFAULT GETDATE()
);

-- لایک‌ها (برای مچ شدن)
CREATE TABLE UserLikes (
    LikerId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    LikeeId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (LikerId, LikeeId)
);

-- بلاک لیست
CREATE TABLE UserBlocks (
    BlockerId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    BlockedId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (BlockerId, BlockedId)
);

-- بازدیدکنندگان (برای بخش چه کسی پروفایل من را دیده است)
CREATE TABLE ProfileVisits (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    VisitorId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    VisitedId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
    VisitDate DATETIME DEFAULT GETDATE()
);

-- محصولات (اشتراک‌ها و ...)
CREATE TABLE Products (
    Id NVARCHAR(50) PRIMARY KEY, -- مثل 'prod_premium'
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Subscription, Badge, Boost
    Description NVARCHAR(MAX) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL
);
```

---

## 2. مدل‌های C# (Entity Framework Core)

این کلاس‌ها را در پوشه `Models` یا `Entities` پروژه ASP.NET Core خود ایجاد کنید.

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FFF.Backend.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(15)]
        public string Mobile { get; set; } // Username
        
        public string Name { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; } // Consider using Enum
        public string Location { get; set; }
        public string Occupation { get; set; }
        public string Bio { get; set; }
        public string PhotoUrl { get; set; }
        public string MaritalStatus { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string FavoriteSport { get; set; }
        public string PartnerPreferences { get; set; }
        
        public bool IsOnline { get; set; }
        public DateTime LastActive { get; set; }
        
        // Geo-location for distance calculation
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public bool IsPremium { get; set; }
        public bool IsGhostMode { get; set; }

        public string StoryUrl { get; set; }
        public DateTime? StoryCreatedAt { get; set; }

        // Navigation Properties
        public UserSettings Settings { get; set; }
        public ICollection<UserGalleryImage> GalleryImages { get; set; }
        public ICollection<Message> SentMessages { get; set; }
        public ICollection<Message> ReceivedMessages { get; set; }
    }

    public class UserSettings
    {
        [Key, ForeignKey("User")]
        public Guid UserId { get; set; }
        public bool NewLikeNotification { get; set; }
        public bool NewMessageNotification { get; set; }
        public bool BiometricLogin { get; set; }
        public bool ProfileViewNotification { get; set; }
        
        public User User { get; set; }
    }

    public class UserGalleryImage
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ImageUrl { get; set; }
        
        public User User { get; set; }
    }

    public class Message
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string Text { get; set; }
        public string ImageUrl { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }

        public User Sender { get; set; }
        public User Receiver { get; set; }
    }
}
```

---

## 3. طراحی API (Controllers)

در پروژه ASP.NET Core، کنترلرها را بر اساس این ساختار ایجاد کنید تا فرانت‌اند بتواند به راحتی متصل شود.

### `AuthController.cs`
مدیریت ورود و ثبت نام با شماره موبایل.

*   `POST /api/auth/send-otp`: دریافت شماره موبایل و ارسال پیامک.
*   `POST /api/auth/verify-otp`: دریافت کد تایید و برگرداندن JWT Token.

### `UsersController.cs`
مدیریت پروفایل‌ها و جستجو.

*   `GET /api/users`: لیست کاربران (صفحه اصلی) با قابلیت فیلتر (Age, Gender, Distance).
    *   *نکته:* برای فیلتر `distance` در SQL Server می‌توانید از تابع `GEOGRAPHY` استفاده کنید یا در C# محاسبه کنید.
*   `GET /api/users/{id}`: جزئیات پروفایل یک کاربر.
*   `PUT /api/users/profile`: ویرایش پروفایل کاربر جاری.
*   `POST /api/users/gallery`: آپلود عکس جدید در گالری.
*   `DELETE /api/users/gallery/{id}`: حذف عکس.
*   `POST /api/users/story`: آپلود استوری.

### `MessagesController.cs` (یا ChatHub با SignalR)
برای چت، پیشنهاد می‌شود از **SignalR** استفاده کنید تا پیام‌ها بلادرنگ (Real-time) باشند.

*   `GET /api/messages/chats`: لیست آخرین مکالمات (ChatListPage).
*   `GET /api/messages/{userId}`: تاریخچه پیام‌ها با یک کاربر خاص.
*   `POST /api/messages`: ارسال پیام (اگر از REST استفاده می‌کنید، اما SignalR بهتر است).

### `InteractionController.cs`
مدیریت لایک، بلاک و بازدید.

*   `POST /api/interaction/like/{userId}`: لایک کردن کاربر.
*   `GET /api/interaction/likes`: لیست کسانی که لایک کرده‌اند (LikesPage).
*   `POST /api/interaction/block/{userId}`: مسدود کردن.
*   `GET /api/interaction/visitors`: لیست بازدیدکنندگان (برای کاربران پرمیوم).

---

## 4. نکاتی برای اتصال فرانت‌اند به بک‌اند

1.  **CORS:** در `Program.cs` حتماً CORS را فعال کنید تا درخواست‌های فرانت‌اند مسدود نشوند.
2.  **JWT Authentication:** از Identity و JWT Bearer برای احراز هویت استفاده کنید. توکن دریافتی در `LoginPage` باید در `localStorage` ذخیره شود.
3.  **SignalR Client:** در فرانت‌اند پکیج `@microsoft/signalr` را نصب کنید تا به ChatHub متصل شوید.

این نقشه راه کامل برای تبدیل این UI به یک اپلیکیشن واقعی است. موفق باشید!
