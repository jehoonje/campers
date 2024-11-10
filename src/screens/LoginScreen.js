// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리 추가
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 임포트
import { AuthContext } from '../AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // 네비게이션 객체 가져오기
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = () => {
    // 로그인 로직 구현 (예: 서버에 요청)
    // 성공 시 토큰 저장 및 메인 화면으로 이동
    fetch('http://10.0.2.2:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
          Alert.alert('로그인 성공', '환영합니다!');
          setIsLoggedIn(true); // 로그인 상태 업데이트
          navigation.navigate('AppContent');
        } else {
          Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
      });
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 구현
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AppContent')}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin}>
          <Text style={styles.buttonText}>Kakao Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('SignupScreen')}
        >
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center',     // 수평 가운데 정렬
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  innerContainer: {
    width: '80%',           // 화면 너비의 80%
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
    fontWeight: 'bold',
    color: '#888',
  },
  input: {
    height: 50,
    width: '100%',          // 부모 컨테이너의 100% (80%의 화면 너비)
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    width: '100%',          // 부모 컨테이너의 100%
    backgroundColor: '#d1d1d1',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  kakaoButton: {
    width: '100%',          // 부모 컨테이너의 100%
    backgroundColor: '#FEE500',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
  },
  signupButton: {
    // 필요한 경우 추가 스타일링
  },
  signupText: {
    color: '#1e90ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
