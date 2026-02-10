using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagement.API.Data;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
   public class TasksController : ControllerBase
   {
       private readonly ApplicationDbContext _context;
  
       public TasksController(ApplicationDbContext context)
       {
           _context = context;
       }


        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddTask([FromBody] CreateTaskDto dto)
        {
            

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ===== Validate DueDate =====
            

            if (dto.DueDate.HasValue && dto.DueDate.Value <= DateTime.UtcNow)
                return BadRequest("Due date must be in the future");

            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description ?? null,
                CreatedDate = DateTime.UtcNow,
                Status = dto.Status ?? Status.Pending,
                DueDate = dto.DueDate ?? null,
                
            };

            // ===== Assign Users (0 | 1 | many) =====
            if (dto.AssignedUserIds != null && dto.AssignedUserIds.Any())
            {
                var users = await _context.Users
                    .Where(u => dto.AssignedUserIds.Contains(u.Id))
                    .ToListAsync();

                if (users.Count != dto.AssignedUserIds.Count)
                    return BadRequest("One or more assigned users do not exist");

                task.AssignedUsers = dto.AssignedUserIds.Select(userId => new UserTask
                {
                    UserId = userId,
                    Status = Status.InProgress,
                    
                }).ToList();
                
            }

            _context.Tasks.Add(task);
          
            await _context.SaveChangesAsync();

            return Ok("Task Created Successfully");
           
        }

        [HttpGet]
        //[Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
           var tasks = await _context.Tasks
            .Include(t => t.AssignedUsers)
            .ThenInclude(ut => ut.User)
            .Select(t => new TaskResponseDto
            {
                TaskId = Convert.ToInt32(t.Id),
                 Title = t.Title,
                 Description = t.Description,
                 Status = t.Status,
                 CreatedDate = t.CreatedDate,
                 DueDate = t.DueDate,
                ClosedDate = t.ClosedDate,
                 AssignedUsers = t.AssignedUsers.Select(ut => new UserTaskInfoDto
                 {
                     UserId = ut.User.Id,
                     UserName = ut.User.UserName,
                     Status = ut.Status,
                     Feedback =ut.Feedback
                 }).ToList()
            })
            .ToListAsync();

            return Ok(tasks);
        }


        [HttpDelete("{id}")]
        //[Authorize(Roles ="SuperAdmin")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound(new { message = "Task not found" });

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully" });
        }

        [HttpGet("search")]
        //[Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> SearchTaskByTitle([FromQuery] string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Title is required");

            title = title.Trim();

            var tasks = await _context.Tasks
                .Where(t =>
                    EF.Functions.Like(t.Title, $"%{title}%"))
                .Include(t => t.AssignedUsers)
                    .ThenInclude(ut => ut.User)
                .Select(t => new TaskResponseDto
                {
                    TaskId = Convert.ToInt32(t.Id),
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    CreatedDate = t.CreatedDate,
                    DueDate = t.DueDate,
                    ClosedDate = t.ClosedDate,

                    AssignedUsers = t.AssignedUsers.Select(ut => new UserTaskInfoDto
                    {
                        UserId = ut.User.Id,
                        UserName = ut.User.UserName,
                        Status = ut.Status,
                        Feedback = ut.Feedback
                    }).ToList()
                })
                .ToListAsync();

            if (!tasks.Any())
                return NotFound("No tasks found with the given title");

            return Ok(tasks);
        }
        [HttpPut("{id}")]
        //[Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
                return NotFound("Task not found");

            // ===== Update only sent fields =====

            if (!string.IsNullOrWhiteSpace(dto.Title))
                task.Title = dto.Title.Trim();

            if (dto.Description != null)
                task.Description = dto.Description;

            if (dto.Status.HasValue)
            {
                if (!Enum.IsDefined(typeof(Status), dto.Status.Value))
                    return BadRequest("Invalid status value");

                task.Status = dto.Status.Value;

               
                if (dto.Status == Status.Completed)
                    task.ClosedDate = DateTime.UtcNow;
            }

            if (dto.DueDate.HasValue)
            {
                if (dto.DueDate.Value <= task.CreatedDate)
                    return BadRequest("DueDate must be after CreatedDate");

                task.DueDate = dto.DueDate.Value;
            }

            await _context.SaveChangesAsync();

            var result = new TaskResponseDto
            {
                TaskId = Convert.ToInt32(task.Id),
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                CreatedDate = task.CreatedDate,
                DueDate = task.DueDate,
                ClosedDate = task.ClosedDate
           
            };

            return Ok(new
            {
                message = "Task updated successfully",
                task = result
            });
        }


        // [HttpPut("{id}")]
        // //[Authorize(Roles = "Admin")]
        // public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
        // {
        //     // update only the Sent Property from request
        //     if (!ModelState.IsValid)
        //         return BadRequest(ModelState);
        //
        //     var task = await _context.Tasks
        //         .Include(t => t.AssignedUsers)
        //         .FirstOrDefaultAsync(t => t.Id == id);
        //
        //     if (task == null)
        //         return NotFound("Task not found");
        //
        //     if (!string.IsNullOrWhiteSpace(dto.Title))
        //         task.Title = dto.Title;
        //
        //     
        //     if (dto.Description != null)
        //         task.Description = dto.Description;
        //
        //     if (dto.Status.HasValue)
        //     {
        //         if (!Enum.IsDefined(typeof(Status), dto.Status.Value))
        //             return BadRequest("Invalid status value");
        //
        //         task.Status = (Status)dto.Status.Value;
        //     }
        //
        //     if (dto.DaysChange.HasValue)
        //     {
        //         var baseDate = task.DueDate ?? task.CreatedDate;
        //         var newDueDate = baseDate.AddDays(dto.DaysChange.Value);
        //
        //         if (newDueDate < task.CreatedDate)
        //             return BadRequest("DueDate cannot be before CreatedDate");
        //
        //         task.DueDate = newDueDate;
        //     }
        //
        //     
        //     if (dto.AssignedUserIds != null)
        //     {
        //         if (dto.AssignedUserIds.Any())
        //         {
        //             var users = await _context.Users
        //                 .Where(u => dto.AssignedUserIds.Contains(u.Id))
        //                 .ToListAsync();
        //
        //             if (users.Count != dto.AssignedUserIds.Count)
        //                 return BadRequest("One or more assigned users do not exist");
        //
        //             task.AssignedUsers.Clear();
        //             task.AssignedUsers = users;
        //         }
        //         else
        //         {
        //             
        //             task.AssignedUsers.Clear();
        //         }
        //     }
        //    
        //
        //     await _context.SaveChangesAsync();
        //
        //    
        //     var result = new TaskResponseDto
        //     {
        //         Id = task.Id,
        //         Title = task.Title,
        //         Description = task.Description,
        //         Status = task.Status.ToString(),
        //         CreatedDate = task.CreatedDate,
        //         DueDate = task.DueDate,
        //         AssignedTo = task.AssignedUsers.Select(u => u.UserName).ToList()
        //     };
        //
        //     return Ok(new { message = "Task updated successfully", task = result });
        // }
        //
        // [HttpDelete("{id}")]
        // //[Authorize(Roles = "Admin")]
        // public async Task<IActionResult> DeleteTask(int id)
        // {
        //     var task = await _context.Tasks.FindAsync(id);
        //     if (task == null) 
        //         return NotFound(new { message = "Task not found" });
        //
        //     _context.Tasks.Remove(task);
        //     await _context.SaveChangesAsync();
        //
        //     return Ok(new { message = "Task deleted successfully" });
        // }
        //
        // [HttpPost("{taskId}/add-users")]
        // //[Authorize(Roles = "Admin")]
        // public async Task<IActionResult> AddUsersToTask(int taskId, [FromBody] List<int> userIds)
        // {
        //     if (userIds == null || !userIds.Any())
        //         return BadRequest("User IDs cannot be empty");
        //
        //     var task = await _context.Tasks
        //         .Include(t => t.AssignedUsers)
        //         .FirstOrDefaultAsync(t => t.Id == taskId);
        //
        //     if (task == null)
        //         return NotFound(new { message = "Task not found" });
        //
        //     var users = await _context.Users
        //         .Where(u => userIds.Contains(u.Id))
        //         .ToListAsync();
        //
        //     if (users.Count != userIds.Count)
        //         return BadRequest("One or more users do not exist");
        //
        //     foreach (var user in users)
        //     {
        //         if (!task.AssignedUsers.Any(u => u.Id == user.Id))
        //             task.AssignedUsers.Add(user);
        //     }
        //
        //     await _context.SaveChangesAsync();
        //
        //     // Convert to DTO to avoid cycles
        //     var result = new TaskResponseDto
        //     {
        //         Id = task.Id,
        //         Title = task.Title,
        //         Description = task.Description,
        //         Status = task.Status.ToString(),
        //         CreatedDate = task.CreatedDate,
        //         DueDate = task.DueDate,
        //         AssignedTo = task.AssignedUsers.Select(u => u.UserName).ToList()
        //     };
        //
        //     return Ok(new { message = "Users added to task successfully", task = result });
        // }
        //
        // [HttpPost("{taskId}/remove-users")]
        // //[Authorize(Roles = "Admin")]
        // public async Task<IActionResult> RemoveUsersFromTask(int taskId, [FromBody] List<int> userIds)
        // {
        //     if (userIds == null || !userIds.Any())
        //         return BadRequest("User IDs cannot be empty");
        //
        //     var task = await _context.Tasks
        //         .Include(t => t.AssignedUsers)
        //         .FirstOrDefaultAsync(t => t.Id == taskId);
        //
        //     if (task == null)
        //         return NotFound(new { message = "Task not found" });
        //
        //     foreach (var userId in userIds)
        //     {
        //         var user = task.AssignedUsers.FirstOrDefault(u => u.Id == userId);
        //         if (user == null)
        //             return BadRequest($"User with Id {userId} is not assigned to this task");
        //
        //         task.AssignedUsers.Remove(user);
        //     }
        //
        //     await _context.SaveChangesAsync();
        //
        //     // Convert to DTO to avoid cycles
        //     var result = new TaskResponseDto
        //     {
        //         Id = task.Id,
        //         Title = task.Title,
        //         Description = task.Description,
        //         Status = task.Status.ToString(),
        //         CreatedDate = task.CreatedDate,
        //         DueDate = task.DueDate,
        //         AssignedTo = task.AssignedUsers.Select(u => u.UserName).ToList()
        //     };
        //
        //     return Ok(new { message = "Users removed from task successfully", task = result });
        // }
    }
}
