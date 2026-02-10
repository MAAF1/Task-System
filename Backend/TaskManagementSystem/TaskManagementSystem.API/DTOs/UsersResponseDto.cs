namespace TaskManagement.API.DTOs
{
    public class UsersResponseDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string UserEmail { get; set; }
       
    }
}
