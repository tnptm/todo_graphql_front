/*
GraphQL authentication queries: LOGIN_MUTATION, ME_QUERY, REGISTER_MUTATION

*/
export const LOGIN_MUTATION = `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      name
    }
  }
}
`;

export const ME_QUERY = `
query Me {
  me {
    id
    email
    name
  }
}
`;

export const REGISTER_MUTATION = `
mutation Register($email: String!, $password: String!, $name: String!) {
  register(email: $email, password: $password, name: $name) {
    token
    user {
      id
      email
      name
    }
  }
}
`;
