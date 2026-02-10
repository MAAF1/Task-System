namespace TaskManagement.API.Models
{
    public class UserTask
    {
        public int TaskId { get; set; }
        public int? UserId { get; set; }
        public string? Feedback {  get; set; }
        public Status Status { get; set; }
        public DateTime? AssignedDate { get; set; }

        public DateTime? DueDate { get; set; }
       
        public DateTime? ClosedDate { get; set; }

        public TaskItem TaskItem { get; set; }
        public ApplicationUser User { get; set; }

    }
}
