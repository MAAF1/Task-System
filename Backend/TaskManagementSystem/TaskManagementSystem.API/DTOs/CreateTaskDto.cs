using System.ComponentModel.DataAnnotations;
using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        
        public Status? Status { get; set; }
        public List<int> AssignedUserIds { get; set; } = new();
    }
}
