import { createContext, useState } from 'react';

export const AuthContext = createContext<{
  sessionToken: string | null;
  updateSession: (token: string | null) => void;
}>({
  sessionToken: null,
  updateSession: () => {
    throw new Error('updateSession not implemented');
  },
});

export function AuthContextProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [sessionToken, setSessionToken] = useState<string | null>(
    null
  );
  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        sessionToken,
        updateSession: (token: string | null) => {
          setSessionToken(token);
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
}
