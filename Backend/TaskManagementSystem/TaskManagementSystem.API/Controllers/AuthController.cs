using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var existingEmail = await _userManager.FindByEmailAsync(dto.Email);
            if (existingEmail != null)
                return BadRequest(new { message = "Email already exists" });

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = "Registration failed", errors = result.Errors.Select(e => e.Description) });

            // Assign default User role
            await _userManager.AddToRoleAsync(user, "User");

            return Ok(new { message = "User registered successfully", userId = user.Id, username = user.UserName, email = user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find user by email
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            // Verify password
            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword)
                return Unauthorized(new { message = "Invalid email or password" });

            // Get user roles
            var roles = await _userManager.GetRolesAsync(user);
            
            // Generate JWT token
            var token = GenerateJwtToken(user, roles);

            return Ok(new 
            { 
                message = "Login successful",
                token, 
                username = user.UserName, 
                email = user.Email,
                roles 
            });
        }

        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var jwtSettings = _config.GetSection("JWT");
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),  
        new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "")
    };

            // Add role claims
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(int.Parse(jwtSettings["DurationInDays"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        //private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        //{
        //    var jwtSettings = _config.GetSection("JWT");
        //    var claims = new List<Claim>
        //    {
        //        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        //        new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
        //        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "")
        //    };
        //
        //    // Add role claims
        //    claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        //
        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        //
        //    var token = new JwtSecurityToken(
        //        issuer: jwtSettings["Issuer"],
        //        audience: jwtSettings["Audience"],
        //        claims: claims,
        //        expires: DateTime.UtcNow.AddDays(7),
        //        signingCredentials: creds
        //    );
        //
        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}
    }
}
