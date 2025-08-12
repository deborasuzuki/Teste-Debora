export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
  due_date?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TodosListResponse {
  success: boolean;
  data: Todo[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
