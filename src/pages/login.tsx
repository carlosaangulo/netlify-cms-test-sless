import Layout from 'components/home/Layout';
import Link from 'next/link';
import LoginForm from '../components/forms/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="mx-4 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mt-24 text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
              Log in
            </h2>
            <p className="mt-2 text-center text-gray-600 text-md">
              {"Don't have an account? "}
              <Link href="/signup">
                <a className="text-royal-blue-500">Sign up</a>
              </Link>
            </p>
          </div>
          <div className="px-4 py-8 mt-8 bg-white rounded-lg shadow-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
