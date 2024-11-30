import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useFocusEffect } from '@react-navigation/native';

const MyProfile = ({navigation}) => {
  const {isLoggedIn, userId, logout} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState('');

  // 유저 정보 로드
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        axiosInstance
          .get(`/users/${userId}`)
          .then(response => {
            console.log('서버에서 받은 프로필 이미지:', response.data.profileImage);
            setProfileImage(response.data.profileImage);
          })
          .catch(error => console.error(error));
      }
    }, [isLoggedIn, userId])
  );

  // 회원 탈퇴
  const deleteAccount = async () => {
    Alert.alert(
      '정말 탈퇴하시겠습니까?',
      '회원 탈퇴는 되돌릴 수 없습니다.',
      [
        {text: '취소'},
        {
          text: '확인',
          onPress: async () => {
            try {
              await axiosInstance.delete(`/users/${userId}/delete`);
              Alert.alert('회원탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
              logout(); // 로그아웃 호출
              navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
            } catch (error) {
              console.error(error);
              Alert.alert(
                '회원탈퇴 실패',
                '회원 탈퇴에 실패했습니다. 다시 시도해주세요.',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
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
        <Image
          source={
            profileImage && profileImage !== ''
              ? {uri: profileImage}
              : require('../../assets/placeholder.png')
          }
          style={styles.profileImage}
        />
      </View>

      {/* 유저 정보 */}
      <Text style={styles.userIdText}>{userId}</Text>

      {/* 버튼들 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>개인정보 수정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={deleteAccount}>
        <Text style={styles.buttonText}>회원 탈퇴</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>로그아웃</Text>
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
  userIdText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2F2F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyProfile;
