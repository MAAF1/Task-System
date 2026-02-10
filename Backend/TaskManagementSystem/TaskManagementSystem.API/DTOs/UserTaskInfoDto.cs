using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class UserTaskInfoDto
    {
        
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public Status Status { get; set; }
        public string? Feedback { get; set; }
    }
}
