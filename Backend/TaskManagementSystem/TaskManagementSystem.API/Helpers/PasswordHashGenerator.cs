using Microsoft.AspNetCore.Identity;

namespace TaskManagement.API.Helpers
{
    public static class PasswordHashGenerator
    {
        public static string GeneratePasswordHash(string password)
        {
            var hasher = new PasswordHasher<object>();
            return hasher.HashPassword(null, password);
        }

        // Run this in Main to see the hash:
        // var hash = GeneratePasswordHash("Admin@123456");
        // Console.WriteLine($"Hash: {hash}");
    }
}       