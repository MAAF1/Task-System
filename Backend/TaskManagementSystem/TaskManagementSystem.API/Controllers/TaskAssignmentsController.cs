using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagement.API.Data;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;

namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class TaskAssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskAssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("{taskId}/assign")]
        public async Task<IActionResult> AssignUser(int taskId, AssignTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks
                .Include(t => t.AssignedUsers)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
                return NotFound("Task not found");

            var users = await _context.Users
                .Where(u => dto.UserIds.Contains(u.Id))
                .Select(u => u.Id)
                .ToListAsync();

            if (users.Count != dto.UserIds.Count)
                return BadRequest("One or more users do not exist");

            foreach (var userId in users)
            {
                if (!task.AssignedUsers.Any(ut => ut.UserId == userId))
                {
                    task.AssignedUsers.Add(new UserTask
                    {
                        UserId = userId,
                        Status = Status.Pending,
                        AssignedDate = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Users assigned successfully" });

        }

        [HttpDelete("{taskId}/users")]
        public async Task<IActionResult> RemoveUsersFromTask(int taskId, [FromBody] RemoveUsersDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks
                .Include(t => t.AssignedUsers)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
                return NotFound("Task not found");

            var assignedUserIds = task.AssignedUsers
                .Select(ut => ut.UserId)
                .ToList();

            foreach (var userId in dto.UserIds)
            {
                if (!assignedUserIds.Contains(userId))
                    return BadRequest($"User {userId} is not assigned to this task");

                var userTask = task.AssignedUsers
                    .First(ut => ut.UserId == userId);

                task.AssignedUsers.Remove(userTask);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Users removed from task successfully" });
        }



    }
}
