using backend.Data;
using backend.Models;
using HotChocolate;
using Microsoft.EntityFrameworkCore;

namespace backend.GraphQL
{
    public class TasksQuery
    {
        public async Task<List<TaskItem>> GetAllTasks(
            [Service] IDbContextFactory<AppDbContext> dbContextFactory,
            CancellationToken cancellationToken)
        {
            await using var db = dbContextFactory.CreateDbContext();
            return await db.Tasks
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
