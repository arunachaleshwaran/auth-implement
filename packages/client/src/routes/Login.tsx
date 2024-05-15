import type { FormEvent, FormEventHandler } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import style from '../styles/login.module.css';
export function Login() {
  const navigate = useNavigate(),
    [search] = useSearchParams();
  const login: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const redirectUrl = search.get('redirectUrl') ?? '/';
    const res = await fetch('http://localhost:4000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: formData.get('userId'),
        password: formData.get('password'),
        redirectUrl,
      }),
    });
    if (!res.ok) {
      throw new Error('Login failed');
    }
    const { callBack } = (await res.json()) as { callBack: string };
    navigate(callBack, { replace: true });
  };
  return (
    <form className={style.form} onSubmit={login}>
      <input
        name='userId'
        pattern='^(?:\d{10}|\w+@\w+\.\w{2,3})$'
        placeholder='Phone Number or Email'
        type='text'
        required
      />
      <input
        minLength={5}
        name='password'
        placeholder='Password'
        type='password'
        required
      />
      <button type='submit'>Login</button>
    </form>
  );
}
