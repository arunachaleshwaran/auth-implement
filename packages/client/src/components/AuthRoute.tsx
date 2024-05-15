import { createSearchParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../Store';

export default function AuthRoute({
  component: Component,
}: Record<string, unknown> & {
  readonly component: React.ReactNode;
}) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.sessionToken === null) {
      navigate(
        {
          pathname: '/login',
          search: createSearchParams({
            redirectUrl: `${location.pathname}${location.search}`,
          }).toString(),
        },
        { replace: true }
      );
    }
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{Component}</>;
}
