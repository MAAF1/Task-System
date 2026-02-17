using System.ComponentModel.DataAnnotations;
using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class TaskResponseDto
    {
        public int TaskId { get; set; }
        
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public Status TaskItemStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string CreatedBy { get; set; }

        public List<UserTaskInfoDto> AssignedUsers { get; set; } = new();
    }
}
