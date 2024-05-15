import { createSearchParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Store';

export function Home() {
  const [date, setDate] = useState(new Date().toISOString());
  const { sessionToken } = useContext(AuthContext),
    navigate = useNavigate();
  useEffect(() => {
    const fetchDate = async () => {
      const res = await fetch('http://localhost:4000/time', {
        headers: new Headers({
          Authorization: sessionToken!,
        }),
      });
      if (res.ok) {
        const { time } = (await res.json()) as { time: string };
        setDate(() => time);
      } else if (res.status === 401) {
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
    };
    void fetchDate();
  }, []);
  return <div>{date}</div>;
}
