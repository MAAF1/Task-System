using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class MyTaskDto
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? TaskDueDate { get; set; }
        public DateTime? TaskClosedDate { get; set; }
        public Status TaskItemStatus { get; set; }

      
        public Status UserStatus { get; set; }
        public DateTime UserAssignedDate { get; set; }
        public DateTime? UserClosedDate { get; set; }
        public DateTime? UserDueDate { get; set; }
        public string? Feedback { get; set; }
    }
}
