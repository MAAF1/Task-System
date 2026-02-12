using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TaskManagement.API.Data;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;


namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserTasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserTasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("my")]
        
        public async Task<IActionResult> GetMyTasks()
        {
            var userIdClaim = User.Claims.Where(x => x.Type.Contains("nameidentifier")).FirstOrDefault().Value;
          

            if (string.IsNullOrWhiteSpace(userIdClaim))
                return Unauthorized("User ID claim not found in token");

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest("Invalid User ID format");

            var tasks = await _context.UserTasks
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.TaskItem)
                .Select(ut => new MyTaskDto
                {
                    TaskId = ut.TaskId,
                    Title = ut.TaskItem.Title,
                    Description = ut.TaskItem.Description,
                    TaskDueDate = ut.TaskItem.DueDate,
                    TaskClosedDate = ut.TaskItem.ClosedDate,
                    TaskItemStatus = ut.TaskItem.Status,

                    UserStatus = ut.Status,
                    UserAssignedDate = ut.AssignedDate ?? DateTime.MinValue,
                    UserClosedDate = ut.ClosedDate,
                    UserDueDate = ut.DueDate,
                    Feedback = ut.Feedback
                })
                .ToListAsync();

            if (!tasks.Any())
                return NotFound("No tasks found for the current user");

            return Ok(tasks);
        }


        
        [HttpPost("{taskId}/complete")]
        public async Task<IActionResult> CompleteTask(int taskId, [FromBody] CompleteTaskDto dto)
        {

            var userIdClaim = User.Claims.Where(x => x.Type.Contains("nameidentifier")).FirstOrDefault().Value;


            if (string.IsNullOrWhiteSpace(userIdClaim))
                return Unauthorized("User ID claim not found in token");

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest("Invalid User ID format");


            var userTask = await _context.UserTasks
                .FirstOrDefaultAsync(ut => ut.TaskId == taskId && ut.UserId == userId);

            if (userTask == null)
                return NotFound(new { message = "Task not found or not assigned to user" });

           
            if (userTask.Status == Status.Completed)
                return BadRequest(new { message = "Task is already completed" });

           
            userTask.Status = Status.Completed;
            userTask.ClosedDate = DateTime.UtcNow;

     

            await _context.SaveChangesAsync();

            
          

            return Ok("Task completed successfully");
        }

        [HttpPut("{taskId}/feedback")]
        public async Task<IActionResult> UpdateFeedback(int taskId, [FromBody] string feedback)
        {
            if (string.IsNullOrWhiteSpace(feedback))
                return BadRequest("Feedback cannot be empty");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userIdClaim))
                return Unauthorized("User not identified");

            var userId = int.Parse(userIdClaim);

            var userTask = await _context.UserTasks
                .FirstOrDefaultAsync(ut => ut.TaskId == taskId && ut.UserId == userId);

            if (userTask == null)
                return NotFound("Task not found for this user");

            userTask.Feedback = feedback;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Feedback updated successfully",
                feedback = userTask.Feedback
            });
        }
    }
}
