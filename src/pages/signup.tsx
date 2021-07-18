import { GetServerSideProps } from 'next';
import Layout from 'components/home/Layout';
import Link from 'next/link';
import SignUpForm from '../components/forms/SignUpForm';
import { getTeamName } from 'services/team';

const SignUpPage: React.FC<{
  teamId?: string;
  teamName?: string;
  email?: string;
}> = ({ teamId, teamName, email }) => {
  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mt-24 text-center">
            <h2 className="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900">
              Sign up
            </h2>
            {teamName ? (
              <h3 className="mt-3 text-3xl font-extrabold leading-9 text-center text-gray-900">{`and join ${teamName}`}</h3>
            ) : (
              <p className="mt-2 text-center text-gray-600 text-md">
                Already have an account?{' '}
                <Link href="/login">
                  <a className="text-royal-blue-500">Log in</a>
                </Link>
              </p>
            )}
          </div>
          <div className="px-4 py-8 mt-8 bg-white shadow-lg sm:rounded-lg sm:px-10">
            <SignUpForm teamId={teamId} email={email} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { teamId, email } = context.query;
  let teamName;

  if (!teamId) {
    return { props: {} };
  }

  if (teamId) {
    teamName = await getTeamName(teamId as string);
  }

  return {
    props: { teamId, teamName, email: email || '' },
  };
};

export default SignUpPage;
