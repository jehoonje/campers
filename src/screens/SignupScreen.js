// src/screens/SignupScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, // 로딩 스피너 추가
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [step, setStep] = useState(1); // 현재 스텝을 추적하는 상태
  const [email, setEmail] = useState(''); // 이메일 상태
  const [emailError, setEmailError] = useState(''); // 이메일 에러 메시지
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 에러 메시지
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 비밀번호 가시성
  const [timer, setTimer] = useState(300); // 5분(300초)
  const [isResendAvailable, setIsResendAvailable] = useState(false); // 재전송 가능 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const intervalRef = useRef(null); // 타이머를 위한 ref
  const navigation = useNavigation();

  // 이메일 중복 확인 함수
  const checkEmailDuplication = () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    // 서버로 이메일 중복 확인 요청
    fetch('http://10.0.2.2:8080/api/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(async (response) => {
        const text = await response.text();
        console.log('서버 응답 상태:', response.status);
        console.log('서버 응답 내용:', text);

        if (!response.ok) {
          // HTTP 상태 코드가 200-299가 아닐 때
          throw new Error(text || '서버 응답이 유효하지 않습니다.');
        }

        try {
          const data = JSON.parse(text);
          if (data.isDuplicate) {
            setEmailError('이미 사용 중인 이메일입니다.');
          } else {
            setEmailError('');
            handleEmailSubmit(); // 인증번호 요청 함수 호출
          }
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
          Alert.alert('오류', '서버 응답을 이해할 수 없습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', error.message || '이메일 확인 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  };

  // 타이머 시작 함수
  const startTimer = () => {
    setTimer(300);
    setIsResendAvailable(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current);
          setIsResendAvailable(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // 스텝이 변경될 때 타이머 관리
  useEffect(() => {
    if (step === 2) {
      startTimer();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [step]);

  // 시간 형식 변환 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}분 ${seconds < 10 ? '0' : ''}${seconds}초`;
  };

  const handleEmailSubmit = () => {
    // 서버로 이메일 전송하여 인증번호 요청
    setIsLoading(true); // 로딩 시작

    fetch('http://10.0.2.2:8080/api/request-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(async (response) => {
        const text = await response.text();
        console.log('서버 응답 상태:', response.status);
        console.log('서버 응답 내용:', text);

        if (!response.ok) {
          // HTTP 상태 코드가 200-299가 아닐 때
          throw new Error(text || '서버 응답이 유효하지 않습니다.');
        }

        try {
          const data = JSON.parse(text);
          if (data.success) {
            setVerificationCode(''); // 인증번호 입력 필드 초기화
            setStep(2); // 다음 스텝으로 이동
            Alert.alert('인증번호 발송', '입력하신 이메일로 인증번호가 발송되었습니다.');
          } else {
            Alert.alert('오류', data.message || '인증번호 발송에 실패했습니다.');
          }
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
          Alert.alert('오류', '서버 응답을 이해할 수 없습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', error.message || '인증번호 요청 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  };

  const handleCodeSubmit = () => {
    // 인증번호 유효성 검사
    if (!verificationCode) {
      Alert.alert('오류', '인증번호를 입력해주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    // 서버로 인증번호 검증 요청
    fetch('http://10.0.2.2:8080/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode }),
    })
      .then(async (response) => {
        const text = await response.text();
        console.log('서버 응답 상태:', response.status);
        console.log('서버 응답 내용:', text);

        if (!response.ok) {
          // HTTP 상태 코드가 200-299가 아닐 때
          throw new Error(text || '서버 응답이 유효하지 않습니다.');
        }

        try {
          const data = JSON.parse(text);
          if (data.success) {
            setStep(3); // 다음 스텝으로 이동
            Alert.alert('인증 성공', '인증번호가 확인되었습니다.');
          } else {
            Alert.alert('오류', data.message || '인증번호가 일치하지 않습니다.');
          }
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
          Alert.alert('오류', '서버 응답을 이해할 수 없습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', error.message || '인증번호 확인 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  };

  const handleResendCode = () => {
    // 서버로 인증번호 재전송 요청
    setIsLoading(true); // 로딩 시작

    fetch('http://10.0.2.2:8080/api/resend-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(async (response) => {
        const text = await response.text();
        console.log('서버 응답 상태:', response.status);
        console.log('서버 응답 내용:', text);

        if (!response.ok) {
          // HTTP 상태 코드가 200-299가 아닐 때
          throw new Error(text || '서버 응답이 유효하지 않습니다.');
        }

        try {
          const data = JSON.parse(text);
          if (data.success) {
            startTimer(); // 타이머 리셋 및 시작
            setVerificationCode(''); // 인증번호 입력 필드 초기화
            Alert.alert('인증번호 재전송', '새로운 인증번호가 발송되었습니다.');
          } else {
            Alert.alert('오류', data.message || '인증번호 재전송에 실패했습니다.');
          }
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
          Alert.alert('오류', '서버 응답을 이해할 수 없습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', error.message || '인증번호 재전송 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (text) => {
    setPassword(text);

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;

    let errorMessage = '';
    if (text.length < 8) {
      errorMessage = '비밀번호는 최소 8자 이상이어야 합니다.';
    } else if (!specialCharRegex.test(text)) {
      errorMessage = '특수문자를 최소 1개 포함해야 합니다.';
    } else if (!letterRegex.test(text)) {
      errorMessage = '영문자를 최소 1개 포함해야 합니다.';
    } else if (!numberRegex.test(text)) {
      errorMessage = '숫자를 최소 1개 포함해야 합니다.';
    } else {
      errorMessage = '사용 가능한 비밀번호입니다.';
    }

    setPasswordError(errorMessage);
  };

  const handleSignup = () => {
    // 비밀번호 유효성 검사
    if (passwordError !== '사용 가능한 비밀번호입니다.') {
      Alert.alert('오류', '비밀번호 조건을 만족하지 않습니다.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    // 서버로 회원가입 요청
    fetch('http://10.0.2.2:8080/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        const text = await response.text();
        console.log('서버 응답 상태:', response.status);
        console.log('서버 응답 내용:', text);

        if (!response.ok) {
          // HTTP 상태 코드가 200-299가 아닐 때
          throw new Error(text || '서버 응답이 유효하지 않습니다.');
        }

        try {
          const data = JSON.parse(text);
          if (data.success) {
            setStep(4); // 가입 완료 스텝으로 이동
          } else {
            Alert.alert('회원가입 실패', data.message || '다시 시도해주세요.');
          }
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
          Alert.alert('오류', '서버 응답을 이해할 수 없습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', error.message || '회원가입 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        // 이메일 입력 단계
        return (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>이메일 입력</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={checkEmailDuplication}>
              <Text style={styles.buttonText}>인증번호 받기</Text>
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="large" color="#1e90ff" />}
          </View>
        );
      case 2:
        // 인증번호 입력 단계
        return (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>인증번호 입력</Text>
            <TextInput
              style={styles.input}
              placeholder="인증번호"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
            />
            <Text style={styles.timerText}>
              남은 시간: {formatTime(timer)}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleCodeSubmit}>
              <Text style={styles.buttonText}>인증하기</Text>
            </TouchableOpacity>

            {isResendAvailable && (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendCode}
              >
                <Text style={styles.resendButtonText}>인증번호 재전송</Text>
              </TouchableOpacity>
            )}
            {isLoading && <ActivityIndicator size="large" color="#1e90ff" />}
          </View>
        );
      case 3:
        // 비밀번호 입력 단계
        return (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>비밀번호 설정</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry={!isPasswordVisible} // 비밀번호 가시성 제어
                autoCapitalize="none" // 대문자 자동 변환 방지
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text
                style={[
                  styles.passwordErrorText,
                  passwordError === '사용 가능한 비밀번호입니다.'
                    ? { color: 'green' }
                    : { color: 'red' },
                ]}
              >
                {passwordError}
              </Text>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="large" color="#1e90ff" />}
          </View>
        );
      case 4:
        // 가입 완료 단계
        return (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>가입 완료</Text>
            <Text style={styles.successText}>회원가입이 완료되었습니다.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.buttonText}>로그인하러 가기</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
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

      {renderStepContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center', // 수직 가운데 정렬
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
    fontSize: 24,
    marginBottom: 32,
    fontWeight: 'bold',
    color: '#888',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  successText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  resendButton: {
    marginTop: 10,
  },
  resendButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorText: {
    width: '100%',
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'left',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  passwordErrorText: {
    width: '100%',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'left',
  },
});

export default SignupScreen;
