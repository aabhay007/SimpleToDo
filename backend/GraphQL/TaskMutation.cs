using backend.Data;
using backend.Models;
using HotChocolate;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace backend.GraphQL
{
    public class TasksMutation
    {
        public async Task<TaskItem> CreateTask(
            string title,
            string? description,
            [Service] IDbContextFactory<AppDbContext> dbContextFactory,
            [Service] ITopicEventSender eventSender)
        {
            await using var db = dbContextFactory.CreateDbContext();

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = title,
                Description = description,
                Status = backend.Models.TaskStatus.Pending 
            };

            db.Tasks.Add(task);
            await db.SaveChangesAsync();

            await eventSender.SendAsync(nameof(TasksSubscription.TaskAdded), task);
            return task;
        }

        public async Task<TaskItem?> UpdateTaskStatus(
            Guid id,
            backend.Models.TaskStatus status, 
            [Service] IDbContextFactory<AppDbContext> dbContextFactory,
            [Service] ITopicEventSender eventSender)
        {
            await using var db = dbContextFactory.CreateDbContext();

            var task = await db.Tasks.FindAsync(id);
            if (task == null) return null;

            task.Status = status;
            await db.SaveChangesAsync();

            await eventSender.SendAsync(nameof(TasksSubscription.TaskUpdated), task);
            return task;
        }
    }
}

