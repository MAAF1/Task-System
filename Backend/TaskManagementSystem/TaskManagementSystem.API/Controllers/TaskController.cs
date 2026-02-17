using System;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using TaskManagement.API.Data;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
   public class TasksController : ControllerBase
   {
       private readonly ApplicationDbContext _context;
  
       public TasksController(ApplicationDbContext context)
       {
           _context = context;
       }


        [HttpPost]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> AddTask([FromBody] CreateTaskDto dto)
        {
            var userIdClaim = User.Claims.Where(x => x.Type.Contains("nameidentifier")).FirstOrDefault().Value;

            
            if (string.IsNullOrWhiteSpace(userIdClaim))
                return Unauthorized("User ID claim not found in token");

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest("Invalid User ID format");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ===== Validate DueDate =====
            

            if (dto.DueDate.HasValue && dto.DueDate.Value <= DateTime.UtcNow)
                return BadRequest("Due date must be in the future");

            var user = await _context.Users.FindAsync(userId);
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description ?? null,
                CreatedDate = DateTime.UtcNow,
                Status = dto.Status ?? Status.Pending,
                DueDate = dto.DueDate ?? null,
                CreatedBy = user,
                CreatedById = userId
                
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
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetAll()
        {
           var tasks = await _context.Tasks
            .Include(t => t.AssignedUsers)
            .ThenInclude(ut => ut.User)
            .Include( t => t.CreatedBy)
            .Select(t => new TaskResponseDto
            {
                TaskId = Convert.ToInt32(t.Id),
                 Title = t.Title,
                 Description = t.Description,
                 TaskItemStatus = t.Status,
                 CreatedDate = t.CreatedDate,
                 DueDate = t.DueDate,
                ClosedDate = t.ClosedDate,
                CreatedBy = t.CreatedBy.UserName,
                 AssignedUsers = t.AssignedUsers.Select(ut => new UserTaskInfoDto
                 {
                     UserId = ut.User.Id,
                     UserName = ut.User.UserName,
                     UserStatus = ut.Status,
                     Feedback =ut.Feedback,
                     AssignedDate = ut.AssignedDate,
                     UserClosedDate = ut.ClosedDate,
                     UserDueDate = ut.DueDate
                     
                 }).ToList()
            })
            .ToListAsync();

            return Ok(tasks);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles ="SuperAdmin")]
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
        [Authorize(Roles = "SuperAdmin,Admin")]
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
                    TaskItemStatus = t.Status,
                    CreatedDate = t.CreatedDate,
                    DueDate = t.DueDate,
                    ClosedDate = t.ClosedDate,
                     

                    AssignedUsers = t.AssignedUsers.Select(ut => new UserTaskInfoDto
                    {
                        UserId = ut.User.Id,
                        UserName = ut.User.UserName,
                        UserStatus = ut.Status,
                        Feedback = ut.Feedback,
                        AssignedDate = ut.AssignedDate,
                        UserClosedDate = ut.ClosedDate,
                        UserDueDate = ut.DueDate

                    }).ToList()
                })
                .ToListAsync();

            if (!tasks.Any())
                return NotFound("No tasks found with the given title");

            return Ok(tasks);
        }


        [HttpGet("getbyid/{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetById( int id)
        {
            
            var tasks = await _context.Tasks
                 .Include(t => t.AssignedUsers)
                    .ThenInclude(ut => ut.User)
                    .Include(t => t.CreatedBy)
                    .Where(t => t.Id == id)
                .Select(t => new TaskResponseDto
                {
                    TaskId = Convert.ToInt32(t.Id),
                    Title = t.Title,
                    Description = t.Description,
                    TaskItemStatus = t.Status,
                    CreatedDate = t.CreatedDate,
                    DueDate = t.DueDate,
                    ClosedDate = t.ClosedDate,
                    CreatedBy = t.CreatedBy.UserName,

                    AssignedUsers = t.AssignedUsers.Select(ut => new UserTaskInfoDto
                    {
                        UserId = ut.User.Id,
                        UserName = ut.User.UserName,
                        UserStatus = ut.Status,
                        Feedback = ut.Feedback,
                        AssignedDate = ut.AssignedDate,
                        UserClosedDate = ut.ClosedDate,
                        UserDueDate = ut.DueDate

                    }).ToList()
                })
                .ToListAsync();

            if (!tasks.Any())
                return NotFound("No tasks found with the given title");

            return Ok(tasks);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin")]
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

            if (dto.TaskItemStatus.HasValue)
            {
                if (!Enum.IsDefined(typeof(Status), dto.TaskItemStatus.Value))
                    return BadRequest("Invalid status value");

                task.Status = dto.TaskItemStatus.Value;

               
                if (dto.TaskItemStatus == Status.Completed)
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
                TaskItemStatus = task.Status,
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

        [HttpGet("GetAllTasksDetailsFromSP")]
        [Authorize(Roles ="Admin, SuperAdmin")]
        public async Task<IActionResult> GetAllTasksDetailsFromSP()
        {
            var taskDetails = new List<TaskDetailDto>();
            // Get connection string to database 
            var connectionString = _context.Database.GetDbConnection().ConnectionString;

            using (var connection = new SqlConnection(connectionString))
            {
                using(var command = new SqlCommand("GetAllTasksDetails", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync()) 
                    { 
                        while (await reader.ReadAsync()) 
                        {
                            taskDetails.Add(new TaskDetailDto
                            {
                                UserName = reader["UserName"]?.ToString(),
                                Title = reader["Title"]?.ToString(),
                                Description = reader["Description"]?.ToString(),
                                CreatedDate = reader["CreatedDate"] as DateTime?,
                                DueDate = reader["DueDate"] as DateTime?,
                                ClosedDate = reader["ClosedDate"] as DateTime?,
                                TaskStatus = reader["TaskStatus"]?.ToString(),
                                CreatedByName = reader["CreatedByName"]?.ToString(),
                                FeedBack = reader["FeedBack"]?.ToString(),
                                UserTaskStatus = reader["UserTaskStatus"]?.ToString(),
                                AssignedDate = reader["AssignedDate"] as DateTime?,
                                UserTaskDueDate = reader["UserDueDate"] as DateTime?,
                                UserTaskClosedDate = reader["UserClosedDate"] as DateTime?
                            });
                        
                        }
                    }
                }
            }


            return Ok(taskDetails);
        }


   }
}
