namespace TaskManagement.API.DTOs
{
    public class TaskDetailDto
    {
        public string UserName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string TaskStatus { get; set; }
        public string CreatedByName { get; set; }
        public string FeedBack { get; set; }
        public string UserTaskStatus { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? UserTaskDueDate { get; set; }
        public DateTime? UserTaskClosedDate { get; set; }
    }
}
