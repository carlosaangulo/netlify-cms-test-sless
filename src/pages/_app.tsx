import { AppProps } from 'next/app';

import { AuthProvider } from 'hooks/useAuth';
import { TeamProvider } from 'hooks/useTeam';
import { ToastProvider } from 'hooks/useToast';
import 'css/tailwind.css';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AuthProvider>
      <TeamProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </TeamProvider>
    </AuthProvider>
  );
}
