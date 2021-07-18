import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useToast } from 'hooks/useToast';
import { useAuth } from 'hooks/useAuth';
import Button from 'components/elements/Button';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const SignUpForm: React.FC<{ teamId?: string; email?: string }> = ({
  teamId,
  email,
}) => {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email,
      password: '',
    },
  });
  const { push } = useRouter();
  const { addToast } = useToast();
  const { user, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = (data: SignUpData): void => {
    setIsLoading(true);
    setError(null);
    signUp(data, teamId).then((response: { error?: { massage: string } }) => {
      setIsLoading(false);
      if (response?.error) {
        setError(response.error);
      } else {
        push(`/dashboard`);
        addToast({
          title: 'Welcome!👋',
          description:
            'You have successfully registered. Please confirm your email.',
          type: 'success',
        });
      }
    });
  };

  useEffect(() => {
    if (user) {
      push('/dashboard');
    }
  }, [user, push]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error?.message && (
        <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
          <span>{error.message}</span>
        </div>
      )}
      <div className="rounded-md">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
          type="text"
          name="name"
          ref={register({
            required: 'Please enter an name',
            minLength: {
              value: 3,
              message: 'name should have at least 3 characters',
            },
          })}
        />
        {errors.name && (
          <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1 rounded-md">
          <input
            id="email"
            className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm ${
              !!email && 'cursor-not-allowed'
            }`}
            type="email"
            name="email"
            ref={register({
              required: 'Please enter an email',
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Not a valid email',
              },
            })}
          />
          {errors.email && (
            <div className="mt-2 text-xs text-red-600">
              {errors.email.message}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 rounded-md">
          <input
            id="password"
            className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            type="password"
            name="password"
            ref={register({
              required: 'Please enter a password',
              minLength: {
                value: 6,
                message: 'Should have at least 6 characters',
              },
            })}
          />
          {errors.password && (
            <div className="mt-2 text-xs text-red-600">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <span className="block w-full rounded-md shadow-sm">
          <Button title="Sign up" type="submit" isLoading={isLoading} />
        </span>
      </div>
    </form>
  );
};

export default SignUpForm;
