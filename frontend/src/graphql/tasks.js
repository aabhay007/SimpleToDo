import { gql } from '@apollo/client';

export const GET_ALL_TASKS = gql`
  query {
    allTasks {
      id
      title
      description
      status
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String) {
    createTask(title: $title, description: $description) {
      id
      title
      description
      status
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: UUID!, $status: TaskStatus!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
