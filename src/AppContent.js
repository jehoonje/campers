import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodoAsync } from './redux/todoSlice';
import TodoItem from './components/TodoItem';
import styles from './styles/AppContentStyles'; // 모듈 스타일 임포트

const AppContent = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const status = useSelector((state) => state.todos.status);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleAddTodo = () => {
    if (newTask.trim() === '') {
      Alert.alert('Validation', 'Please enter a valid task');
      return;
    }
    const newTodo = {
      task: newTask,
    };
    dispatch(addTodoAsync(newTodo));
    setNewTask('');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>DREAM BIG, START SMALL, ACT NOW.</Text>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Enter a new task"
          placeholderTextColor="#aaa"
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
          <Text style={styles.buttonText}>Add Todo</Text>
        </TouchableOpacity>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TodoItem todo={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default AppContent;
