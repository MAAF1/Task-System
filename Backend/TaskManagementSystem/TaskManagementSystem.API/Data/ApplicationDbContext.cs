using Microsoft.EntityFrameworkCore;
using TaskManagement.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Reflection.Emit;

namespace TaskManagement.API.Data
{
    public class ApplicationDbContext
                                     : IdentityDbContext<ApplicationUser, ApplicationRole, int,
         IdentityUserClaim<int>,
         IdentityUserRole<int>,
         IdentityUserLogin<int>,
         IdentityRoleClaim<int>,
         IdentityUserToken<int>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<UserTask> UserTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserTask>()
                .HasKey(ut => new { ut.TaskId, ut.UserId });

            builder.Entity<UserTask>()
                .HasOne(ut => ut.TaskItem)
                .WithMany(t => t.AssignedUsers)
                .HasForeignKey(ut => ut.TaskId);

            builder.Entity<UserTask>()
                .HasOne(ut => ut.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(ut => ut.UserId)
                .OnDelete(DeleteBehavior.Cascade); ;

            builder.Entity<TaskItem>()
                .Property(t => t.CreatedDate)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Entity<UserTask>()
                .Property(t => t.AssignedDate)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Entity<TaskItem>()
                .HasOne(t => t.CreatedBy)
                .WithMany()
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

        }

    }
}
