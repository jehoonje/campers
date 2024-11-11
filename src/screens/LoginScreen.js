// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리 추가
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 임포트
import { AuthContext } from '../AuthContext';
import axiosInstance from '../utils/axiosInstance'; // 중앙화된 Axios 인스턴스 임포트

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      console.log('서버 응답:', response.data); // 응답 데이터 로그 출력

      const { accessToken, refreshToken, message } = response.data;

      if (accessToken && refreshToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        Alert.alert('로그인 성공', '환영합니다!');
        setIsLoggedIn(true);
        navigation.navigate('AppContent');
      } else if (message) {
        Alert.alert('로그인 실패', message);
      } else {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('로그인 실패', error.response.data.message);
      } else {
        Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 구현
    Alert.alert('카카오 로그인', '카카오 로그인 기능은 아직 구현되지 않았습니다.');
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
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin} disabled={loading}>
          <Text style={[styles.buttonText, { color: '#000' }]}>Kakao Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('SignupScreen')}
          disabled={loading}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoButton: {
    width: '100%',          // 부모 컨테이너의 100%
    backgroundColor: '#FEE500',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
