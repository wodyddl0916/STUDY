import React, { useState } from 'react';
import api from '../api/axios'; 
import '../css/SignUpForm.css';
import SignUpFormIntro from '../components/signup/SignUpFormIntro';
import SignUpFormCard from '../components/signup/SignUpFormCard';

export default function SignUpForm({ onNavigate }) {
  // 1. 폼 상태 관리 (불필요 항목 제거 및 전력 데이터 파일 추가)
  const [form, setForm] = useState({
    name: '',           
    email: '',          
    password: '',
    confirmPassword: '',
    region: '',         
    powerDataFile: null, // CSV 파일 객체 저장
    agree: false,
  });

  // 입력값 변경 핸들러 (파일 처리 로직 포함)
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // 파일 입력인 경우 첫 번째 파일만 저장
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // 2. 회원가입 제출 로직
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 검증
    if (!form.email || !form.password) {
      alert('이메일과 비밀번호는 필수 입력 항목입니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!form.agree) {
      alert('약관에 동의해주세요.');
      return;
    }

    try {
      // 🌟 파일이 포함되므로 FormData 객체 생성
      const formData = new FormData();
      formData.append('username', form.email); // 이메일을 계정 ID로 사용
      formData.append('password', form.password);
      formData.append('nickname', form.name || form.email.split('@')[0]);
      formData.append('region', form.region);
      
      // 전력 데이터 파일이 있으면 추가
      if (form.powerDataFile) {
        formData.append('powerDataFile', form.powerDataFile);
      }

      // API 호출 (multipart/form-data 설정)
      const response = await api.post('/api/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        const displayName = form.name || form.email.split('@')[0];
        alert(`${displayName}님, 와트메이트에 오신 것을 환영합니다!`);
        onNavigate('login');
      }
    } catch (error) {
      console.error('회원가입 에러 상세:', error);
      const message = error.response?.data?.message || '회원가입 실패: 서버 연결 상태를 확인하세요.';
      alert(message);
    }
  };

  return (
    <div className="signupform-page">
      <div className="signupform-overlay"></div>
      <div className="signupform-container">
        <div className="signupform-left">
          <SignUpFormIntro />
        </div>
        <div className="signupform-right">
          <SignUpFormCard
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onNavigate={onNavigate}
            onChangeRegion={(region) => setForm(prev => ({ ...prev, region }))}
            onChangeLocation={({ region }) => setForm(prev => ({ ...prev, region }))}
          />
        </div>
      </div>
    </div>
  );
}