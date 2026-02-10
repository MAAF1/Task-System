using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.Models
{
    public class TaskItem
    {
        public int? Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public Status Status { get; set; }

        public int? CreatedById { get; set; } // FK to User
        public ApplicationUser? CreatedBy { get; set; } = null!;

        public DateTime CreatedDate { get; set; } 

        public DateTime? DueDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        


        public ICollection<UserTask>? AssignedUsers { get; set; }
    }
}

