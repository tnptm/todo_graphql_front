import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { HttpLink } from "@apollo/client/link/http";
/*
import {
  //ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/link/http";
*/

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql/",
  credentials: "omit",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
