// EditProfile.js

import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../AuthContext';
import axiosInstance from '../../utils/axiosInstance'; // axios 설정
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import placeholderImage from '../../assets/placeholder.png';

const EditProfile = ({ navigation }) => {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      axiosInstance
        .get(`/users/${userId}`)
        .then(response => {
          setUserName(response.data.userName);
          setEmail(response.data.email);
          setProfileImageUrl(response.data.profileImageUrl); // 유저 프로필 사진
        })
        .catch(error => console.error(error));
    }
  }, [isLoggedIn, userId]);

  const handleProfileImageChange = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('사용자가 이미지 선택을 취소했습니다.');
      } else if (response.errorCode) {
        console.log('이미지 선택 오류: ', response.errorMessage);
      } else {
        const image = response.assets[0];
        setNewProfileImage(image);
      }
    });
  };

  const handleSaveChanges = async () => {
    if (userName === '' && !newProfileImage) {
      Alert.alert('변경 사항 없음', '수정할 내용이 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('userName', userName);
    if (newProfileImage) {
      formData.append('image', {
        name: newProfileImage.fileName,
        type: newProfileImage.type,
        uri:
          Platform.OS === 'ios'
            ? newProfileImage.uri.replace('file://', '')
            : newProfileImage.uri,
      });
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        await axiosInstance.put(`/users/${userId}/update`, formData, {
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
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleProfileImageChange}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                newProfileImage
                  ? { uri: newProfileImage.uri }
                  : profileImageUrl && profileImageUrl !== ''
                  ? { uri: profileImageUrl }
                  : placeholderImage
              }
              style={styles.profileImage}
            />
            <Ionicons name="camera" size={30} color="#333" style={styles.cameraIcon} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 유저 이름 */}
      <View style={styles.inputContainer}>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="사용자 이름"
          style={styles.input}
        />
        <Ionicons name="pencil" size={20} color="#333" style={styles.pencilIcon} />
      </View>

      {/* 이메일 */}
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          editable={false}
          placeholder="이메일"
          style={[styles.input, { color: '#999' }]}
        />
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Ionicons name="checkmark" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
  },
  backButton: {
    // 추가 스타일 필요 없음
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginTop: 50,
    marginBottom: 40,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  pencilIcon: {
    marginLeft: 5,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  saveButton: {
    backgroundColor: '#2F2F2F',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;
