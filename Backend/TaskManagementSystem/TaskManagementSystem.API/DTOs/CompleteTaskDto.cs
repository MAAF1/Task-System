using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class CompleteTaskDto
    {
        public int TaskId { get; set; }
        public string? Feedback { get; set; } // optional
        public Status Status { get; set; } = Status.Completed;
    }
}
