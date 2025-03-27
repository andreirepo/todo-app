export const getTodos = state => state.todos.data || [];
export const getTodosLoading = state => state.todos.isLoading;

export const getCompletedTodos = state => {
  const todos = getTodos(state);
  return todos.filter(todo => todo.isCompleted);
};

export const getIncompleteTodos = state => {
  const todos = getTodos(state);
  return todos.filter(todo => !todo.isCompleted);
};
