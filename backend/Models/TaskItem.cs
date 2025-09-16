using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public enum TaskStatus { Pending, Completed }

    public class TaskItem
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Pending;
    }
}
