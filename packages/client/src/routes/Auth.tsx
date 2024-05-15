import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../Store';
import loginStyle from '../styles/login.module.css';
import { useContext } from 'react';
export function Auth() {
  const [search] = useSearchParams(),
    navigate = useNavigate();
  const { updateSession } = useContext(AuthContext);
  const redirect = () => {
    const redirectUrl = search.get('redirectUrl'),
      token = search.get('token');
    updateSession(token);
    navigate(redirectUrl ?? '/', { replace: true });
  };
  return (
    <div className={loginStyle.form}>
      Redirect to verify. Generally this will be mailed
      <button type='button' onClick={redirect}>
        Verify
      </button>
    </div>
  );
}
