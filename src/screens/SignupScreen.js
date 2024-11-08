// src/screens/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [step, setStep] = useState(1); // 현재 스텝을 추적하는 상태
  const [email, setEmail] = useState(''); // 이메일 상태
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const navigation = useNavigation();

  const handleEmailSubmit = () => {
    // 이메일 유효성 검사
    if (!email) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return;
    }

    // 서버로 이메일 전송하여 인증번호 요청
    fetch('http://your-server-url.com/api/request-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStep(2); // 다음 스텝으로 이동
          Alert.alert('인증번호 발송', '입력하신 이메일로 인증번호가 발송되었습니다.');
        } else {
          Alert.alert('오류', data.message || '인증번호 발송에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', '인증번호 요청 중 오류가 발생했습니다.');
      });
  };

  const handleCodeSubmit = () => {
    // 인증번호 유효성 검사
    if (!verificationCode) {
      Alert.alert('오류', '인증번호를 입력해주세요.');
      return;
    }

    // 서버로 인증번호 검증 요청
    fetch('http://your-server-url.com/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStep(3); // 다음 스텝으로 이동
          Alert.alert('인증 성공', '인증번호가 확인되었습니다.');
        } else {
          Alert.alert('오류', data.message || '인증번호가 일치하지 않습니다.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', '인증번호 확인 중 오류가 발생했습니다.');
      });
  };

  const handleSignup = () => {
    // 비밀번호 유효성 검사
    if (!password) {
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      return;
    }

    // 서버로 회원가입 요청
    fetch('http://your-server-url.com/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStep(4); // 가입 완료 스텝으로 이동
        } else {
          Alert.alert('회원가입 실패', data.message || '다시 시도해주세요.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
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
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
              <Text style={styles.buttonText}>인증번호 받기</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.button} onPress={handleCodeSubmit}>
              <Text style={styles.buttonText}>인증하기</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        // 비밀번호 입력 단계
        return (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>비밀번호 설정</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
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
      {step !== 1 && (
        <TouchableOpacity
          onPress={() => setStep(step - 1)}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      )}

      {renderStepContent()}
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
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#d1d1d1',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
  },
  successText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 32,
  },
});

export default SignupScreen;
