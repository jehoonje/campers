import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteTodoAsync } from '../redux/todoSlice';

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    Alert.alert('Confirmation', '정말 삭제하시겠습니까?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => dispatch(deleteTodoAsync(todo.id)),
      },
    ]);
  };

  return (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{todo.task}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  todoItem: {
    backgroundColor: '#444',  // 아이템 배경을 짙은 회색으로 변경
    marginBottom: 10,
    padding: 20,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 18,
    color: 'white',  // 글씨를 흰색으로 변경
  },
  deleteButton: {
    backgroundColor: '#800020',  // 삭제 버튼 색을 붉은색으로 변경
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',  // 삭제 버튼 텍스트를 흰색으로 변경
  },
});
