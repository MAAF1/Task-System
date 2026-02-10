using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert Roles
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "Name", "NormalizedName", "ConcurrencyStamp" },
                values: new object[,]
                {
            { 1, "SuperAdmin", "SUPERADMIN", Guid.NewGuid().ToString() },
            { 2, "Admin", "ADMIN", Guid.NewGuid().ToString() },
            { 3, "User", "USER", Guid.NewGuid().ToString() }
                });

            // Insert SuperAdmin User
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[]
                {
            "Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail",
            "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
            "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled", "AccessFailedCount"
                },
                values: new object[]
                {
            1,
            "superadmin",
            "SUPERADMIN",
            "superadmin@taskmanagement.com",
            "SUPERADMIN@TASKMANAGEMENT.COM",
            true,
            "AQAAAAIAAYagAAAAEDcnyNest+U4Jq1DPQeKQGhF6B74cTZcx0C8OSPgE2Vhi7T4zTH0o3ySDUQv7yRRdg==", // hashed
           //AQAAAAIAAYagAAAAEDcnyNest+U4Jq1DPQeKQGhF6B74cTZcx0C8OSPgE2Vhi7T4zTH0o3ySDUQv7yRRdg==
            Guid.NewGuid().ToString(),
            Guid.NewGuid().ToString(),
            false,
            false,
            true,
            0
                });

            // Assign SuperAdmin role
            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[] { 1, 1 }); // SuperAdmin role Id = 1
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove role assignment
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "UserId", "RoleId" },
                keyValues: new object[] { 1, 1 });

            // Delete SuperAdmin user
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1);

            // Delete roles
            migrationBuilder.DeleteData("AspNetRoles", "Id", 1);
            migrationBuilder.DeleteData("AspNetRoles", "Id", 2);
            migrationBuilder.DeleteData("AspNetRoles", "Id", 3);
        }


    }
}
