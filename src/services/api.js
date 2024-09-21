// src/services/api.js
const API_BASE_URL = 'http://10.0.2.2:8080/api/todos'; // 서버 IP와 포트를 실제 값으로 변경하세요.

export const fetchTodosFromAPI = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 응답 오류: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

export const addTodoToAPI = async (todo) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 응답 오류: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const deleteTodoFromAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 응답 오류: ${response.status} - ${errorText}`);
    }

    return;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
