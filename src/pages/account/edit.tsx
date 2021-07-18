import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { storage } from 'config/firebase';
import { useToast } from 'hooks/useToast';
import { useRequireAuth } from 'hooks/useRequireAuth';
import BreadCrumbs from 'components/dashboard/BreadCrumbs';
import Layout from 'components/dashboard/Layout';
import AccountMenu from 'components/dashboard/AccountMenu';
import ConfirmModal from 'components/dashboard/ConfirmModal';

const breadCrumbs = {
  back: {
    path: '/account',
    text: 'Back',
  },
  first: {
    path: '/account',
    text: 'Account',
  },
  second: {
    path: '/account/edit',
    text: 'Edit',
  },
};

const EditAccount: React.FC = () => {
  const { push } = useRouter();
  const { addToast } = useToast();
  const auth = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      name: auth.user?.name,
    },
  });

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      console.log(rejectedFiles);
    }
    const file = acceptedFiles[0];
    if (file.type.includes('image')) {
      handleUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!auth.user) return null;

  const handleUpload = (image) => {
    const uploadTask = storage
      .ref(`users/${auth.user.uid}/${image?.name}`)
      .put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref(`users/${auth.user.uid}`)
          .child(image?.name)
          .getDownloadURL()
          .then((url) => {
            setAvatarUrl(url);
          });
      }
    );
  };

  const onSubmit = (values) => {
    setIsLoading(true);
    setError(null);

    const data = { ...values };
    if (avatarUrl) {
      data.avatarUrl = avatarUrl;
    }

    auth
      .updateUser({ id: auth.user.uid, data })
      .then((response: { error?: { massage: string } }) => {
        setIsLoading(false);
        if (response?.error) {
          setError(response.error);
        } else {
          push('/account');
          addToast({
            title: 'Profile updated',
            description: 'You have successfully updated your account',
            type: 'success',
          });
        }
      });
  };

  const deleteAccount = () => {
    setIsLoading(true);
    setError(null);
    auth
      .deleteUser()
      .then(function () {
        addToast({
          title: 'Account deleted',
          description: 'You have successfully deleted your account',
          type: 'success',
        });
        push('/');
      })
      .catch(function (error) {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
        setShowConfirmModal(false);
      });
  };

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                Account
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 px-5 py-6 mx-auto overflow-hidden bg-white rounded-lg shadow-lg sm:block sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error?.message && (
                <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                  <span>{error.message}</span>
                </div>
              )}
              <div>
                <div>
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Edit account
                    </h3>
                    <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-500">
                      Update your account information
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Name
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-xs rounded-md shadow-sm">
                          <input
                            id="name"
                            name="name"
                            className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                            ref={register({
                              required: 'Please enter a username',
                            })}
                          />
                          {errors?.name && (
                            <div className="mt-2 text-xs text-red-600">
                              {errors?.name.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Email address
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-xs mt-1 text-sm leading-5 text-gray-900 ">
                          {auth.user.email}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        Photo
                      </label>
                      <div className="mt-2 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                            {avatarUrl || auth.user.avatarUrl ? (
                              <span className="relative inline-block">
                                <img
                                  className="object-cover w-12 h-12 rounded-md"
                                  src={avatarUrl || auth.user.avatarUrl}
                                  alt={auth.user?.name}
                                />
                              </span>
                            ) : (
                              <svg
                                className="w-full h-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                          </span>
                          <div>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <span className="ml-5 rounded-md shadow-sm">
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                  >
                                    Drop here
                                  </button>
                                </span>
                              ) : progress && progress !== 100 ? (
                                <div className="max-w-sm ml-3 rounded-md shadow bg-grey-light m-w-64">
                                  <div
                                    className="py-1 text-xs leading-none text-center text-white rounded-md bg-royal-blue-600"
                                    style={{ width: `${progress}%` }}
                                  >
                                    {`${progress}%`}
                                  </div>
                                </div>
                              ) : (
                                <span className="ml-5 rounded-md shadow-sm">
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                  >
                                    Change
                                  </button>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5 mt-8 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium leading-5 text-red-500 transition duration-150 ease-in-out border border-red-500 rounded-md hover:text-red-600 focus:outline-none focus:border-red-300 focus:shadow-outline-blue active:bg-red-50 active:text-red-800"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Delete account
                  </button>
                  <div className="flex justify-end">
                    <span className="inline-flex rounded-md shadow-sm">
                      <Link href="/account">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                        >
                          Cancel
                        </button>
                      </Link>
                    </span>
                    <span className="inline-flex ml-3 rounded-md shadow-sm">
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-royal-blue-600 hover:bg-royal-blue-500 focus:outline-none focus:border-royal-blue-700 focus:shadow-outline-royal-blue active:bg-royal-blue-700"
                      >
                        {isLoading ? 'Loading...' : 'Save'}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          closeModal={() => setShowConfirmModal(false)}
          title={'Are you sure?'}
          text={
            'Your account and any other related data will be permanently deleted. You can not undo this action.'
          }
          confirmText={isLoading ? 'Deleting...' : 'Delete account'}
          confirmAction={() => deleteAccount()}
        />
      )}
    </Layout>
  );
};

export default EditAccount;
