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
            try
            {
                // Try multiple claim types to find user ID
                var userIdClaim = User.Claims
                    .FirstOrDefault(x => 
                        x.Type.Contains("nameidentifier") || 
                        x.Type == "sub" || 
                        x.Type == System.Security.Claims.ClaimTypes.NameIdentifier
                    )?.Value;

                if (string.IsNullOrWhiteSpace(userIdClaim))
                {
                    // Debug: log all available claims
                    var allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                    System.Diagnostics.Debug.WriteLine($"Available claims: {System.Text.Json.JsonSerializer.Serialize(allClaims)}");
                    return Unauthorized("User ID claim not found in token");
                }

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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading tasks", error = ex.Message });
            }
        }


        
        [HttpPost("{taskId}/complete")]
        public async Task<IActionResult> CompleteTask(int taskId, [FromBody] CompleteTaskDto dto)
        {
            try
            {
                // Try multiple claim types to find user ID
                var userIdClaim = User.Claims
                    .FirstOrDefault(x => 
                        x.Type.Contains("nameidentifier") || 
                        x.Type == "sub" || 
                        x.Type == System.Security.Claims.ClaimTypes.NameIdentifier
                    )?.Value;

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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error completing task", error = ex.Message });
            }
        }

        [HttpPut("{taskId}/feedback")]
        public async Task<IActionResult> UpdateFeedback(int taskId, [FromBody] string feedback)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(feedback))
                    return BadRequest("Feedback cannot be empty");

                // Try multiple claim types to find user ID
                var userIdClaim = User.Claims
                    .FirstOrDefault(x => 
                        x.Type.Contains("nameidentifier") || 
                        x.Type == "sub" || 
                        x.Type == System.Security.Claims.ClaimTypes.NameIdentifier
                    )?.Value;

                if (string.IsNullOrWhiteSpace(userIdClaim))
                    return Unauthorized("User not identified");

                if (!int.TryParse(userIdClaim, out int userId))
                    return BadRequest("Invalid User ID format");

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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating feedback", error = ex.Message });
            }
        }
    }
}
