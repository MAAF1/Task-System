using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.DTOs
{
    public class AssignTaskDto
    {
        [Required]
        public List<int> UserIds { get; set; } = new();
    }
}
