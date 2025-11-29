import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text) {
      todo {
        id
        text
        completed
        createdAt
        owner {
          id
          username
        }
      }
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean, $text: String) {
    updateTodo(id: $id, completed: $completed, text: $text) {
      todo {
        id
        text
        completed
      }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      ok
    }
  }
`;
