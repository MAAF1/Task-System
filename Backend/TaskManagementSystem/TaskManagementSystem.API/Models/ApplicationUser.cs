using Microsoft.AspNetCore.Identity;

namespace TaskManagement.API.Models
{
    public class ApplicationUser : IdentityUser<int>
    {

        public ICollection<UserTask> Tasks { get; set; } 
    }
}
