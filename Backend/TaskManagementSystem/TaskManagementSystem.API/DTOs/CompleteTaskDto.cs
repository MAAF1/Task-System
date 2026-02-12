using TaskManagement.API.Models;

namespace TaskManagement.API.DTOs
{
    public class CompleteTaskDto
    {
       
        
        public Status Status { get; set; } = Status.Completed;
    }
}
