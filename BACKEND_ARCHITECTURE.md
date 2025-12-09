# مستندات کامل بک‌اند (ASP.NET Core 8)

این فایل شامل تمام کدهای مورد نیاز برای راه‌اندازی بک‌اند است. مشکل "خطا در خواندن users/{id}" معمولاً به دلیل **چرخه بی‌پایان JSON (Circular Reference)** رخ می‌دهد. در کدهای زیر با استفاده از `[JsonIgnore]` و تنظیمات `Program.cs` این مشکل رفع شده است.

---

## 1. تنظیمات اصلی (Program.cs)

این بخش حیاتی است. خط `ReferenceHandler.IgnoreCycles` باعث می‌شود که اگر در دیتابیس رابطه‌های دوطرفه (User -> Image -> User) وجود داشت، برنامه کرش نکند.

```csharp
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FFF.Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Add Controllers with JSON Cycle Fix
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// 3. CORS Policy (Allow Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// 4. JWT Authentication
var key = Encoding.ASCII.GetBytes("THIS_IS_A_VERY_LONG_SECRET_KEY_FOR_JWT_SECURITY_AT_LEAST_32_CHARS");
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

// Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## 2. دیتابیس کانتکست (Data/AppDbContext.cs)

```csharp
using FFF.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace FFF.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserGalleryImage> UserGalleryImages { get; set; }
        public DbSet<UserSettings> UserSettings { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // تنظیم رابطه یک به یک برای Settings
            modelBuilder.Entity<User>()
                .HasOne(u => u.Settings)
                .WithOne(s => s.User)
                .HasForeignKey<UserSettings>(s => s.UserId);
                
            // جلوگیری از خطای Multiple Cascade Paths در SQL Server برای مسیج‌ها
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
```

---

## 3. مدل‌ها (Models)

به ویژگی **`[JsonIgnore]`** در کلاس‌های فرزند دقت کنید. این ویژگی جلوی خطا را می‌گیرد.

```csharp
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FFF.Backend.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        [Required, MaxLength(15)]
        public string Mobile { get; set; }
        public string? Name { get; set; }
        public int Age { get; set; }
        public string? Gender { get; set; }
        public string? Location { get; set; }
        public string? Occupation { get; set; }
        public string? Bio { get; set; }
        public string? PhotoUrl { get; set; }
        public string? StoryUrl { get; set; }
        public string? MaritalStatus { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string? FavoriteSport { get; set; }
        public string? PartnerPreferences { get; set; }
        public bool IsOnline { get; set; }
        public DateTime LastActive { get; set; }
        public bool IsPremium { get; set; }
        public bool IsGhostMode { get; set; }

        // OTP Fields
        public string? OtpCode { get; set; }
        public DateTime? OtpExpiry { get; set; }

        public UserSettings? Settings { get; set; }
        public ICollection<UserGalleryImage>? GalleryImages { get; set; }

        [JsonIgnore]
        public ICollection<Message>? SentMessages { get; set; }
        [JsonIgnore]
        public ICollection<Message>? ReceivedMessages { get; set; }
    }

    public class UserGalleryImage
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ImageUrl { get; set; }

        [JsonIgnore] // <<--- این خط بسیار مهم است
        public User User { get; set; }
    }

    public class UserSettings
    {
        [Key]
        public Guid UserId { get; set; }
        public bool NewLikeNotification { get; set; }
        public bool NewMessageNotification { get; set; }
        public bool BiometricLogin { get; set; }
        public bool ProfileViewNotification { get; set; }

        [JsonIgnore] // <<--- جلوگیری از چرخه
        public User User { get; set; }
    }
    
    public class Message
    {
        [Key]
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string? Text { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime Timestamp { get; set; }
        
        [JsonIgnore]
        public User Sender { get; set; }
        [JsonIgnore]
        public User Receiver { get; set; }
    }
}
```

---

## 4. کنترلرها (Controllers)

### UsersController.cs
این همان کنترلری است که شما با آن مشکل داشتید. با کدهای بالا و `Include` زیر، مشکل حل می‌شود.

```csharp
using FFF.Backend.Data;
using FFF.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserProfile(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.GalleryImages)
                .Include(u => u.Settings)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();
            
            return Ok(user);
        }

        // PUT: api/users/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] User updatedUser)
        {
            // در یک سناریوی واقعی، ID را از توکن می‌گیریم: User.FindFirst("id")?.Value
            // اینجا برای سادگی فرض می‌کنیم ID در بادی ارسال شده یا مکانیزم دیگری دارد
            // برای تست: 
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            
            var id = Guid.Parse(userIdStr);
            var user = await _context.Users.FindAsync(id);

            if (user == null) return NotFound();

            user.Name = updatedUser.Name ?? user.Name;
            user.Bio = updatedUser.Bio ?? user.Bio;
            user.Occupation = updatedUser.Occupation ?? user.Occupation;
            user.Location = updatedUser.Location ?? user.Location;
            // ... بروزرسانی سایر فیلدها
            
            if (!string.IsNullOrEmpty(updatedUser.PhotoUrl)) user.PhotoUrl = updatedUser.PhotoUrl;
            if (!string.IsNullOrEmpty(updatedUser.StoryUrl)) user.StoryUrl = updatedUser.StoryUrl;

            await _context.SaveChangesAsync();
            return Ok(user);
        }
    }
}
```

### AuthController.cs
مسئول ارسال OTP و لاگین.

```csharp
using FFF.Backend.Data;
using FFF.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FFF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const string SECRET_KEY = "THIS_IS_A_VERY_LONG_SECRET_KEY_FOR_JWT_SECURITY_AT_LEAST_32_CHARS";

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.Mobile);
            if (user == null)
            {
                user = new User 
                { 
                    Mobile = request.Mobile,
                    Name = "کاربر جدید",
                    Age = 18,
                    IsPremium = false,
                    Settings = new UserSettings() // ایجاد تنظیمات پیش‌فرض
                };
                _context.Users.Add(user);
            }

            // تولید کد ۴ رقمی تصادفی
            var otp = new Random().Next(1000, 9999).ToString();
            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(2);

            await _context.SaveChangesAsync();

            // در محیط واقعی، اینجا باید SMS ارسال شود.
            // برای تست، کد را در کنسول لاگ می‌کنیم یا برمی‌گردانیم (فقط برای دیباگ)
            return Ok(new { message = "OTP Sent", debugCode = otp });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Mobile == request.Mobile);

            if (user == null || user.OtpCode != request.OtpCode)
            {
                return BadRequest(new { message = "Invalid OTP" });
            }

            if (user.OtpExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "OTP Expired" });
            }

            // پاک کردن کد مصرف شده
            user.OtpCode = null;
            await _context.SaveChangesAsync();

            // تولید توکن
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SECRET_KEY);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.MobilePhone, user.Mobile)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString, UserId = user.Id });
        }
    }

    public class LoginRequest { public string Mobile { get; set; } }
    public class VerifyRequest { public string Mobile { get; set; } public string OtpCode { get; set; } }
}
```

### MessagesController.cs

```csharp
using FFF.Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMessages(Guid userId)
        {
            // دریافت ID کاربر جاری از توکن
            var currentUserIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdStr)) return Unauthorized();
            var currentUserId = Guid.Parse(currentUserIdStr);

            var messages = await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                            (m.SenderId == userId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(messages);
        }
    }
}
```