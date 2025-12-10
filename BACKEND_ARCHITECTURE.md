
# مستندات کامل بک‌اند (ASP.NET Core 8)

این فایل شامل تمام کدهای مورد نیاز برای راه‌اندازی بک‌اند است. مشکل Swagger و خطاهای مربوط به JSON Cycle و Validation در این نسخه رفع شده‌اند.

---

## 1. تنظیمات اصلی (Program.cs)

**تغییرات مهم:** اضافه شدن `AddSwaggerGen` و `UseSwagger` برای رفع خطای 404 و قابلیت تست API.

```csharp
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models; // فضای نام جدید برای Swagger
using System.Text;
using FFF.Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Add Controllers with JSON Cycle Fix
// نکته مهم: این تنظیم جلوی خطای "A possible object cycle was detected" را می‌گیرد.
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// 3. Swagger / OpenAPI Configuration (رفع خطای 404)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FFF Backend API", Version = "v1" });

    // تنظیمات دکمه Authorize (قفل) در Swagger برای تست توکن
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// 4. CORS Policy (Allow Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// 5. JWT Authentication
// کلید باید دقیقاً با کلید داخل AuthController یکسان باشد.
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

// 6. HttpContext Accessor (برای دسترسی به User ID در سرویس‌ها)
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    
    // فعال‌سازی Swagger (این خطوط برای رفع خطای 404 الزامی هستند)
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "FFF Backend API v1"));
}

app.UseHttpsRedirection(); // معمولاً در لوکال هاست فعال است
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
        public DbSet<UserInteraction> UserInteractions { get; set; } // جدید: برای لایک و بلاک

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // تنظیم رابطه یک به یک برای Settings
            modelBuilder.Entity<User>()
                .HasOne(u => u.Settings)
                .WithOne(s => s.User)
                .HasForeignKey<UserSettings>(s => s.UserId);
                
            // جلوگیری از خطای Multiple Cascade Paths برای پیام‌ها
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

            // تنظیمات جدول تعاملات (Interaction)
            modelBuilder.Entity<UserInteraction>()
                .HasOne(i => i.SourceUser)
                .WithMany()
                .HasForeignKey(i => i.SourceUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserInteraction>()
                .HasOne(i => i.TargetUser)
                .WithMany()
                .HasForeignKey(i => i.TargetUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
```

---

## 3. مدل‌ها (Models)

تمام مدل‌ها شامل `[JsonIgnore]` برای جلوگیری از حلقه در سریال‌سازی هستند.
تغییرات: `BirthDate` اضافه شد و `UserSettings.User` نال‌پذیر شد.

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
        public DateTime? BirthDate { get; set; } // فیلد جدید
        public string? Gender { get; set; } // Male, Female, Other
        public string? Location { get; set; }
        public string? Occupation { get; set; }
        public string? Bio { get; set; }
        public string? PhotoUrl { get; set; } // عکس اصلی پروفایل
        public string? StoryUrl { get; set; } // عکس استوری
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
        [JsonIgnore]
        public string? OtpCode { get; set; }
        [JsonIgnore]
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

        [JsonIgnore]
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

        [JsonIgnore]
        public User? User { get; set; } // Nullable برای رفع خطای Validation
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

    public class UserInteraction
    {
        [Key]
        public Guid Id { get; set; }
        public Guid SourceUserId { get; set; }
        public Guid TargetUserId { get; set; }
        public InteractionType Type { get; set; } // Like, Block, Report
        public DateTime Timestamp { get; set; }

        [JsonIgnore]
        public User SourceUser { get; set; }
        [JsonIgnore]
        public User TargetUser { get; set; }
    }

    public enum InteractionType
    {
        Like = 0,
        Block = 1,
        Report = 2,
        View = 3
    }
}
```

---

## 4. کنترلرها (Controllers)

### UsersController.cs
**تغییر مهم:** اضافه شدن `UpdateUserProfileDto` و استفاده از آن در متد `UpdateProfile` برای جلوگیری از خطای `Mobile is required` هنگام آپدیت و همچنین محاسبه سن از روی تاریخ تولد.

```csharp
using FFF.Backend.Data;
using FFF.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace FFF.Backend.Controllers
{
    // DTO برای آپدیت پروفایل: در این مدل موبایل اجباری نیست
    public class UpdateUserProfileDto
    {
        public string? Name { get; set; }
        public int Age { get; set; }
        public DateTime? BirthDate { get; set; } // جدید
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
        public bool IsGhostMode { get; set; }
        
        public UserSettingsDto? Settings { get; set; }
    }

    public class UserSettingsDto
    {
        public bool NewLikeNotification { get; set; }
        public bool NewMessageNotification { get; set; }
        public bool BiometricLogin { get; set; }
        public bool ProfileViewNotification { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers(
            [FromQuery] int maxAge, 
            [FromQuery] string? gender,
            [FromQuery] bool isOnline,
            [FromQuery] string? location)
        {
            var query = _context.Users.Include(u => u.GalleryImages).AsQueryable();
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != null)
            {
                var id = Guid.Parse(currentUserId);
                query = query.Where(u => u.Id != id);
            }

            if (maxAge > 0)
                query = query.Where(u => u.Age <= maxAge);
            
            if (!string.IsNullOrEmpty(gender) && gender != "همه")
                query = query.Where(u => u.Gender == gender);
                
            if (isOnline)
                query = query.Where(u => u.IsOnline == true);

            if (!string.IsNullOrEmpty(location))
                query = query.Where(u => u.Location.Contains(location));

            var users = await query.Take(50).ToListAsync();
            return Ok(users);
        }

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
        // استفاده از DTO برای رفع خطای Validation
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            
            var id = Guid.Parse(userIdStr);
            var user = await _context.Users.Include(u => u.Settings).FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            if (dto.Name != null) user.Name = dto.Name;
            if (dto.Bio != null) user.Bio = dto.Bio;
            if (dto.Occupation != null) user.Occupation = dto.Occupation;
            if (dto.Location != null) user.Location = dto.Location;
            
            // محاسبه سن از روی تاریخ تولد
            if (dto.BirthDate.HasValue)
            {
                user.BirthDate = dto.BirthDate.Value;
                var today = DateTime.Today;
                var age = today.Year - user.BirthDate.Value.Year;
                if (user.BirthDate.Value.Date > today.AddYears(-age)) age--;
                user.Age = age;
            }
            else if (dto.Age > 0)
            {
                user.Age = dto.Age;
            }

            if (dto.Height > 0) user.Height = dto.Height;
            if (dto.Weight > 0) user.Weight = dto.Weight;
            if (dto.Gender != null) user.Gender = dto.Gender;
            if (dto.MaritalStatus != null) user.MaritalStatus = dto.MaritalStatus;
            if (dto.FavoriteSport != null) user.FavoriteSport = dto.FavoriteSport;
            if (dto.PartnerPreferences != null) user.PartnerPreferences = dto.PartnerPreferences;
            
            if (!string.IsNullOrEmpty(dto.PhotoUrl)) user.PhotoUrl = dto.PhotoUrl;
            if (!string.IsNullOrEmpty(dto.StoryUrl)) user.StoryUrl = dto.StoryUrl;
            
            user.IsGhostMode = dto.IsGhostMode;

            if (dto.Settings != null)
            {
                if (user.Settings == null) user.Settings = new UserSettings { UserId = user.Id };
                user.Settings.NewLikeNotification = dto.Settings.NewLikeNotification;
                user.Settings.NewMessageNotification = dto.Settings.NewMessageNotification;
                user.Settings.ProfileViewNotification = dto.Settings.ProfileViewNotification;
                user.Settings.BiometricLogin = dto.Settings.BiometricLogin;
            }

            await _context.SaveChangesAsync();
            return Ok(user);
        }
    }
}
```

### InteractionController.cs

```csharp
using FFF.Backend.Data;
using FFF.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FFF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InteractionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InteractionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("like/{targetUserId}")]
        public async Task<IActionResult> LikeUser(Guid targetUserId)
        {
            var sourceUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var exists = await _context.UserInteractions
                .AnyAsync(i => i.SourceUserId == sourceUserId && i.TargetUserId == targetUserId && i.Type == InteractionType.Like);

            if (exists) return Ok(new { message = "Already liked" });

            var interaction = new UserInteraction
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId,
                Type = InteractionType.Like,
                Timestamp = DateTime.UtcNow
            };

            _context.UserInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Liked successfully" });
        }

        [HttpGet("likes")]
        public async Task<IActionResult> GetReceivedLikes()
        {
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var likers = await _context.UserInteractions
                .Where(i => i.TargetUserId == currentUserId && i.Type == InteractionType.Like)
                .Select(i => i.SourceUser)
                .ToListAsync();

            return Ok(likers);
        }

        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] BlockRequest request)
        {
            var sourceUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Name == request.UserName);
            if (targetUser == null) return NotFound("User not found");

            var interaction = new UserInteraction
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUser.Id,
                Type = InteractionType.Block,
                Timestamp = DateTime.UtcNow
            };

            _context.UserInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User blocked" });
        }

        [HttpPost("report/{targetUserId}")]
        public async Task<IActionResult> ReportUser(Guid targetUserId)
        {
            var sourceUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var interaction = new UserInteraction
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId,
                Type = InteractionType.Report,
                Timestamp = DateTime.UtcNow
            };

            _context.UserInteractions.Add(interaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report submitted" });
        }

        [HttpGet("blocks")]
        public async Task<IActionResult> GetBlockedUsers()
        {
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var blockedUsers = await _context.UserInteractions
                .Where(i => i.SourceUserId == currentUserId && i.Type == InteractionType.Block)
                .Select(i => i.TargetUser)
                .ToListAsync();

            return Ok(blockedUsers);
        }

        [HttpPost("unblock/{targetUserId}")]
        public async Task<IActionResult> UnblockUser(Guid targetUserId)
        {
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var blockRecord = await _context.UserInteractions
                .FirstOrDefaultAsync(i => i.SourceUserId == currentUserId && i.TargetUserId == targetUserId && i.Type == InteractionType.Block);

            if (blockRecord != null)
            {
                _context.UserInteractions.Remove(blockRecord);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Unblocked" });
        }
    }

    public class BlockRequest { public string UserName { get; set; } }
}
```

### AuthController.cs

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
                    Settings = new UserSettings()
                };
                _context.Users.Add(user);
            }

            var otp = new Random().Next(1000, 9999).ToString();
            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(2);

            await _context.SaveChangesAsync();
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

            user.OtpCode = null;
            await _context.SaveChangesAsync();

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
using FFF.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FFF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var messages = await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                            (m.SenderId == userId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var message = new Message
            {
                SenderId = currentUserId,
                ReceiverId = request.ReceiverId,
                Text = request.Text,
                ImageUrl = request.ImageUrl,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        [HttpGet("chats")]
        public async Task<IActionResult> GetChats()
        {
            var currentUserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var allMessages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();

            var chats = allMessages
                .GroupBy(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
                .Select(g => {
                    var lastMsg = g.First();
                    var otherUser = lastMsg.SenderId == currentUserId ? lastMsg.Receiver : lastMsg.Sender;
                    return new {
                        Id = g.Key,
                        UserId = otherUser.Id,
                        UserName = otherUser.Name,
                        UserPhoto = otherUser.PhotoUrl,
                        LastMessage = lastMsg.Text ?? "تصویر",
                        Timestamp = lastMsg.Timestamp,
                        UnreadCount = 0
                    };
                });

            return Ok(chats);
        }
    }

    public class SendMessageRequest
    {
        public Guid ReceiverId { get; set; }
        public string? Text { get; set; }
        public string? ImageUrl { get; set; }
    }
}
```

---

## 5. اسکریپت SQL برای ساخت جدول Interaction

```sql
CREATE TABLE [UserInteractions] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [SourceUserId] UNIQUEIDENTIFIER NOT NULL,
    [TargetUserId] UNIQUEIDENTIFIER NOT NULL,
    [Type] INT NOT NULL, -- 0: Like, 1: Block, 2: Report, 3: View
    [Timestamp] DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT [FK_UserInteractions_Users_SourceUserId] FOREIGN KEY ([SourceUserId]) REFERENCES [Users] ([Id]),
    CONSTRAINT [FK_UserInteractions_Users_TargetUserId] FOREIGN KEY ([TargetUserId]) REFERENCES [Users] ([Id])
);

CREATE INDEX [IX_UserInteractions_SourceUserId] ON [UserInteractions] ([SourceUserId]);
CREATE INDEX [IX_UserInteractions_TargetUserId] ON [UserInteractions] ([TargetUserId]);
```

همچنین به یاد داشته باشید که فیلد `BirthDate` را هم باید به جدول `Users` اضافه کنید:
```sql
ALTER TABLE [Users] ADD [BirthDate] DATETIME2 NULL;
```
