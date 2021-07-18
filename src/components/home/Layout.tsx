import { ReactNode } from 'react';
import { NextPage } from 'next';

import Header from 'components/home/Header';
import Footer from 'components/home/Footer';

interface Props {
  children: ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
