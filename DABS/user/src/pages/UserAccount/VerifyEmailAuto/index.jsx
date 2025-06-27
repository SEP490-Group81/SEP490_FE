import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Result } from 'antd';


const VerifyEmailAuto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = params.get('c');
    console.log('c:', c);
    // if (c) {
    //   verifyEmail({ c }).then(res => {
    //     if (res.success) {
    //       setStatus('success');
    //       setTimeout(() => navigate('/login'), 2000);
    //     } else {
    //       setStatus('error');
    //       setMessage(res.message);
    //     }
    //   });
    // } else {
    //   setStatus('error');
    //   setMessage('Thiếu mã xác thực!');
    // }
  }, [location.search, navigate]);

  if (status === 'pending') {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
        <div style={{ marginTop: 24, fontSize: 18 }}>Đang xác thực email, vui lòng chờ...</div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <Result
        status="success"
        title="Xác thực thành công!"
        subTitle="Bạn sẽ được chuyển tới trang đăng nhập."
      />
    );
  }

  return (
    <Result
      status="error"
      title="Xác thực thất bại!"
      subTitle={message || "Đường dẫn xác thực không hợp lệ hoặc đã hết hạn."}
    />
  );
};

export default VerifyEmailAuto;
