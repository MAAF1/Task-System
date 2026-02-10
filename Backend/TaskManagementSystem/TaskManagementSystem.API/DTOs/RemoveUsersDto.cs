using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.DTOs
{
    public class RemoveUsersDto
    {
        [Required]
        public List<int> UserIds { get; set; } = new();
    }
}
