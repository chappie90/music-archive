import React, { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const Login = () => {
  const { authState, authService } = useOktaAuth();

  useEffect(() => {
    login();
  }, []);

  const login = async () => {
     authService.login('/dashboard/homepage');
  };

  return (
    <div>
      Login Page
    </div>
  );
};

export default Login;