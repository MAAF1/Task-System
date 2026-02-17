using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class UserTaskInfoDto
    {
        
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public Status UserStatus { get; set; }
        public string? Feedback { get; set; }
        public DateTime? AssignedDate { get; set; }

        public DateTime? UserDueDate { get; set; }

        public DateTime? UserClosedDate { get; set; }


    }
}
