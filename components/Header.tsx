// @ts-ignore
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Menu, Transition } from '@headlessui/react'
import { useForm } from "react-hook-form";
import { Fragment } from 'react'

export default function Header() {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const { handleSubmit, formState } = useForm();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({ connector: new InjectedConnector() });
    const userData = { address: account, chain: chain.id, network: 'evm' };

    try {
      const response = await fetch('/api/auth/request-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      const message = data.message;
      const signature = await signMessageAsync({ message });
      await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/' });

      console.log('successful');
    } catch (error) {
      console.error(error);
    }
  };

  let left = (
    <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
      <Link href="/" data-active={isActive('/')}>
        Home
      </Link>
    </div>
  );

  let right = null;

  if (!session) {
    right = (
      <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded">
        <button onClick={submitData}>Authenticate via Metamask</button>
      </div>
    );
  }

  if (session) {
    left = (
      <div className='flex '>
        <Link href="/" className="inline-flex w-full justify-center rounded-md bg-dao-green px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75" data-active={isActive('/')}>
          Home
        </Link>
      </div>
    );
    right = (
      <div className="flex">
        <p className='mr-3'>
          {session?.user?.name}
        </p>
        <div className="">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-dao-green px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                Options
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="z-50 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <Link className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                        href="/updateUser">
                        <button>
                          Update User
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                        href="/newRewardRound"                          >
                        <button disabled={!session?.user?.isAdmin}>
                          New Reward Round
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                        href="/newTeam"                          >
                        <button disabled={!session?.user?.isAdmin}>
                          New Team
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                        onClick={() => signOut({ callbackUrl: '/' })}>
                        <a>Log out</a>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    );
  }

  return (
    <nav className="mt-16 mb-16 flex md:mb-12 md:flex-row justify-between">
      {left}
      {right}
    </nav>
  );
};