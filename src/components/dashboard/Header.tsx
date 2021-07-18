import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Transition from 'components/shared/Transition';
import { useAuth } from 'hooks/useAuth';
import { useToast } from 'hooks/useToast';
import { useOnClickOutside } from 'hooks/useClickOutside';
import PlanPill from './PlanPill';

export const DashboardHeader: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const auth = useAuth();
  const dropdownNode = useRef();
  const navbarNode = useRef();
  const hamburgerNode = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useOnClickOutside(dropdownNode, () => setDropdownOpen(false));
  useOnClickOutside(navbarNode, () => setNavbarOpen(false));

  if (!auth.user) return null;

  const signOut = () => {
    auth.signOut().then(() =>
      addToast({
        title: 'Until next time!👋',
        description: 'You are successfully signed out.',
        type: 'success',
      })
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <Link href="/dashboard">
                <a href="" className="flex">
                  <img
                    className="w-auto h-8 sm:h-10"
                    src="/img/logo.png"
                    alt="Serverless SaaS Boilerplate"
                  />
                </a>
              </Link>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10">
                  <Link href="/dashboard">
                    <a
                      className={
                        router.pathname === '/dashboard'
                          ? 'mr-4 px-3 py-2 rounded text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-gray-600 focus:bg-gray-100'
                          : 'mr-4 px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
                      }
                    >
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/account">
                    <a
                      className={
                        router.pathname?.includes('/account')
                          ? 'px-3 py-2 rounded text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-gray-600 focus:bg-gray-100'
                          : 'px-3 py-2 rounded text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
                      }
                    >
                      Account
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-row items-center hidden md:flex">
              <div>
                <PlanPill />
              </div>
              <div className="flex items-center ml-4 md:ml-6">
                <div className="relative ml-3" ref={dropdownNode}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center max-w-xs text-sm text-white rounded-full focus:outline-none focus:shadow-solid"
                  >
                    <span className="inline-block w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
                      {auth.user?.avatarUrl ? (
                        <img
                          className="object-cover w-full h-full rounded"
                          src={auth.user.avatarUrl}
                          alt={auth.user.name}
                        />
                      ) : (
                        <svg
                          className="w-full h-full text-gray-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                  </button>

                  <Transition
                    show={dropdownOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="absolute right-0 w-48 mt-2 origin-top-right rounded-lg shadow-xl">
                      <div className="py-1 bg-white rounded shadow-xs">
                        <Link href="/account">
                          <a
                            href=""
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            Account
                          </a>
                        </Link>
                        <Link href="/account/team">
                          <a
                            href=""
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            Team
                          </a>
                        </Link>
                        <Link href="/account/billing">
                          <a
                            href=""
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            Billing
                          </a>
                        </Link>
                        {auth.user?.isAdmin && (
                          <Link href="/admin">
                            <a
                              href=""
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              Admin
                            </a>
                          </Link>
                        )}
                        <a
                          href="/"
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => signOut()}
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
            <div className="flex -mr-2 md:hidden" ref={hamburgerNode}>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {navbarOpen ? (
                    <path
                      className="inline-flex"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      className="inline-flex"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {navbarOpen && (
        <div
          className="block border-b border-gray-200 md:hidden"
          ref={navbarNode}
        >
          <div className="px-2 py-3 sm:px-3">
            <Link href="/dashboard">
              <a
                href="#"
                className={
                  router.pathname?.includes('dashboard')
                    ? 'block px-3 py-2 rounded text-base font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-100'
                    : 'block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
                }
              >
                Dashboard
              </a>
            </Link>
            <Link href="/account">
              <a
                href="#"
                className={
                  router.pathname?.includes('account')
                    ? 'mt-1 block px-3 py-2 rounded text-base font-medium text-gray-900 bg-gray-200 focus:outline-none focus:text-white focus:bg-gray-100'
                    : 'mt-1 block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
                }
              >
                Account
              </a>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                {auth.user?.avatarUrl ? (
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={auth.user.avatarUrl}
                    alt={auth.user.name}
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-300 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {auth.user.name}
                </div>
                <div className="mt-1 text-sm font-medium leading-none text-gray-600">
                  {auth.user.email}
                </div>
              </div>
            </div>
            <div className="px-2 mt-3">
              <a
                href="/#"
                className="block px-3 py-2 mt-1 text-base font-medium text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100"
                onClick={() => signOut()}
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardHeader;
