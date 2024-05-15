import { useContext, useEffect } from 'react';
import { AuthContext } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function AuthRoute({
  component: Component,
}: Record<string, unknown> & {
  readonly component: React.ReactNode;
}) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.sessionToken === null) {
      navigate('/login', { state: 'all' });
    }
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{Component}</>;
}
