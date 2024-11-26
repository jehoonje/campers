// src/screens/EditProfile.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosInstance'; // axios 설정
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ navigation }) => {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      axiosInstance.get(`/user/${userId}`)
        .then(response => {
          setUserName(response.data.userName);
          setEmail(response.data.email);
          setProfileImage(response.data.profileImage); // 유저 프로필 사진
        })
        .catch(error => console.error(error));
    }
  }, [isLoggedIn, userId]);

  const handleProfileImageChange = async (image) => {
    setNewProfileImage(image);
  };

  const handleSaveChanges = async () => {
    if (userName === '' || userName === profileImage) {
      Alert.alert('변경 사항 없음', '수정할 내용이 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('userName', userName);
    if (newProfileImage) {
      formData.append('image', newProfileImage);
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        await axiosInstance.put(`/user/${userId}/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('저장되었습니다.');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('저장 실패', '수정된 정보를 저장하는 데 실패했습니다.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="#333"
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 20, left: 20 }}
      />
      {/* 프로필 이미지 */}
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={handleProfileImageChange}>
          <Image
            source={{ uri: newProfileImage ? newProfileImage.uri : profileImage }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </TouchableOpacity>
      </View>

      {/* 유저 이름 */}
      <TextInput
        value={userName}
        onChangeText={setUserName}
        placeholder={userName}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      {/* 이메일 */}
      <TextInput
        value={email}
        editable={false}
        placeholder={email}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      {/* 저장 버튼 */}
      <TouchableOpacity onPress={handleSaveChanges}>
        <Ionicons name="checkmark" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;
