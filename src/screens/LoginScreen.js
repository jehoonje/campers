// src/screens/LoginScreen.js
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import axiosInstance from '../utils/axiosInstance';
import {
  login as kakaoLogin,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import AnimatedTitle from './AnimatedTitle';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const [step, setStep] = useState(1); // 로그인 단계 관리
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태 추가
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const {login} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // **Google Sign-In 초기화**
  GoogleSignin.configure({
    webClientId:
      '958440013761-f29q36hrr58t7s07pjdbs9b9e89dm3tm.apps.googleusercontent.com',
    offlineAccess: true,
  });

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    if (!email) {
      Alert.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setEmailError(''); // 오류 메시지 초기화
    setStep(2);
  };

  const handleSignIn = async () => {
    if (!password) {
      Alert.alert('입력 오류', '비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      console.log('서버 응답:', response.data);

      const {accessToken, refreshToken, message} = response.data;

      if (accessToken && refreshToken) {
        await login(accessToken, refreshToken);
        Alert.alert('로그인 성공', '환영합니다!');
        navigation.navigate('AppContent');
      } else if (message) {
        Alert.alert('로그인 실패', message);
      } else {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert('로그인 실패', error.response.data.message);
      } else {
        Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setLoading(true);
    try {
      const result = await kakaoLogin();
      console.log('카카오 로그인 성공:', result);

      const profile = await getKakaoProfile();
      console.log('카카오 프로필 정보:', profile);

      const response = await axiosInstance.post(
        'http://10.0.2.2:8080/api/auth/kakao',
        {
          accessToken: result.accessToken,
        },
      );

      const {accessToken, refreshToken, message} = response.data;

      if (accessToken && refreshToken) {
        await login(accessToken, refreshToken);
        Alert.alert('로그인 성공', '카카오 계정으로 로그인되었습니다.');
        navigation.navigate('AppContent');
      } else if (message) {
        Alert.alert('로그인 실패', message);
      } else {
        Alert.alert('로그인 실패', '카카오 로그인 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert('로그인 실패', error.response.data.message);
      } else if (error.response && error.response.data) {
        Alert.alert('로그인 실패', error.response.data);
      } else {
        Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // **Google 로그인 함수 추가**
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo.data;

      // 백엔드로 idToken 전송
      const response = await axiosInstance.post(
        'http://10.0.2.2:8080/api/auth/google',
        {
          idToken: idToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const {accessToken, refreshToken, message} = response.data;

      if (accessToken && refreshToken) {
        await login(accessToken, refreshToken);
        Alert.alert('로그인 성공', 'Google 계정으로 로그인되었습니다.');
        navigation.navigate('AppContent');
      } else if (message) {
        Alert.alert('로그인 실패', message);
      } else {
        Alert.alert('로그인 실패', 'Google 로그인 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Google 로그인 오류:', error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert('로그인 실패', error.response.data.message);
      } else if (error.response && error.response.data) {
        Alert.alert('로그인 실패', error.response.data);
      } else {
        Alert.alert('로그인 실패', 'Google 로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AppContent')}
        style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        {/* 단계 1: 이메일 입력 */}
        {step === 1 && (
          <>
            <AnimatedTitle
              style={styles.title}
              text={`아이디를\n입력해주세요.`}
            />

            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError(''); // 이메일 입력 시 오류 메시지 초기화
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: validateEmail(email)
                    ? '#333'
                    : 'transparent',
                },
              ]}
              onPress={handleContinue}
              disabled={loading || !validateEmail(email)}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.continueButtonText,
                    {color: validateEmail(email) ? '#fff' : '#ccc'},
                  ]}>
                  계속하기
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* 단계 2: 비밀번호 입력 */}
        {step === 2 && (
          <>
            <AnimatedTitle
              style={styles.title}
              text={`비밀번호를\n입력해주세요.`}
            />

            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignIn}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>로그인</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* 조건부로 회원가입 버튼 또는 이메일 다시 입력하기 버튼 표시 */}
        {step === 1 ? (
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('SignupScreen', {email: email})}
            disabled={loading}>
            <Text style={styles.signupText}>회원 가입</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => {
              setStep(1);
              setPassword('');
            }}
            disabled={loading}>
            <Text style={styles.signupText}>이메일 다시 입력하기</Text>
          </TouchableOpacity>
        )}

        {/* 구분선과 간편로그인 */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>간편로그인</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 카카오 로그인 버튼 */}
        <TouchableOpacity
          style={styles.kakaoButton}
          onPress={handleKakaoLogin}
          disabled={loading}>
            <Image
              source={require('../assets/kakaobutton.png')}
              style={styles.kakaoButtonImage}
              resizeMode="contain"
            />
        </TouchableOpacity>

        {/* Google 로그인 버튼 추가 */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={loading}>
            <Image
              source={require('../assets/googlebutton.png')}
              style={styles.googleButtonImage}
              resizeMode="contain"
            />          
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // justifyContent: 'center', // 수직 가운데 정렬
    alignItems: 'center', // 수평 가운데 정렬
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  innerContainer: {
    width: '80%', // 화면 너비의 80%
    alignItems: 'center',
  },
  title: {
    width: '100%',
    fontSize: 28,
    marginTop: 150,
    marginRight: 10,
    marginBottom: 100,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'left',
    lineHeight: 34, // 줄 간격 추가
  },
  input: {
    height: 50,
    width: '100%',
    paddingHorizontal: 4,
    borderBottomWidth: 1, // 아래에 밑줄 추가
    borderBottomColor: '#ddd', // 밑줄 색상 설정
    fontSize: 18,
    backgroundColor: 'transparent', // 배경 투명하게 설정
    marginBottom: 8, // 입력 필드와 오류 메시지 간격
  },
  errorText: {
    width: '100%',
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'left',
  },
  continueButton: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: '#aaa',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24, // 버튼과 입력 필드 간격 조정
  },
  continueButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 1,
  },
  kakaoButton: {
    width: '100%',
    backgroundColor: '#FEE500',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoButtonImage: {
    width: '100%',
    height: 50,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  googleButtonImage: {
    width: '100%',
    height: 50,
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 18,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 12,
    // 필요한 경우 추가 스타일링
  },
  signupText: {
    color: '#555',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 14,
  },
  backToEmailButton: {
    marginTop: 8,
  },
  backToEmailText: {
    color: '#1e90ff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
