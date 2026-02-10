using System.ComponentModel.DataAnnotations;
using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class UpdateTaskDto
    {

       
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public Status? Status { get; set; }

    }
}
