import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../AuthContext';
import axiosInstance from '../../utils/axiosInstance'; // axios 설정
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import placeholderImage from '../../assets/placeholder.png';

const EditProfile = ({navigation}) => {
  const {userId, isLoggedIn} = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      axiosInstance
        .get(`/users/${userId}`)
        .then(response => {
          setUserName(response.data.userName);
          setEmail(response.data.email);
          setProfileImage(response.data.profileImage); // 유저 프로필 사진
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
      <Ionicons
        name="arrow-back"
        size={24}
        color="#333"
        onPress={() => navigation.goBack()}
        style={styles.backIcon}
      />
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleProfileImageChange}>
          <Image
            source={
              newProfileImage
                ? {uri: newProfileImage.uri}
                : profileImage && profileImage !== ''
                ? {uri: profileImage}
                : placeholderImage
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* 유저 이름 */}
      <TextInput
        value={userName}
        onChangeText={setUserName}
        placeholder={userName}
        style={styles.input}
      />
      {/* 이메일 */}
      <TextInput
        value={email}
        editable={false}
        placeholder={email}
        style={styles.input}
      />

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2F2F2F',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;
