"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TODOS } from "../graphql/queries";
import { CREATE_TODO, UPDATE_TODO, DELETE_TODO } from "../graphql/mutations";

function AddTodo({ onAdded }) {
  const [value, setValue] = useState("");
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    await createTodo({ variables: { text: value } });
    setValue("");
    onAdded?.();
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: "1rem" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New todo"
        autoFocus
        className="border rounded-lg px-2 py-1 bg-gray-100 border-stone-400"
      />
      <button
        type="submit"
        className="bg-blue-400 text-white px-3 py-1 rounded-lg ml-4 hover:bg-blue-500 transition-colors duration-300 easy-in-out"
      >
        Add
      </button>
    </form>
  );
}

export default function TodoList() {
  const { data, loading, error } = useQuery(GET_TODOS);
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const todos = data?.todos || [];

  return (
    <div>
      <AddTodo />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() =>
                  updateTodo({
                    variables: { id: t.id, completed: !t.completed },
                  })
                }
              />
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                }}
              >
                {t.text}
              </span>
              <button
                style={{ marginLeft: "auto" }}
                onClick={() => deleteTodo({ variables: { id: t.id } })}
                className="bg-gray-600 text-gray-200 px-2 py-0.5 rounded-lg hover:bg-gray-500 transition-colors ease-in-out duration-300"
              >
                Delete
              </button>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
