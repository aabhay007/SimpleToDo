using backend.Models;
using HotChocolate;

namespace backend.GraphQL
{
    public class TasksSubscription
    {
        [Subscribe]
        [Topic]
        public TaskItem TaskAdded([EventMessage] TaskItem task) => task;

        [Subscribe]
        [Topic]
        public TaskItem TaskUpdated([EventMessage] TaskItem task) => task;
    }
}
