// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
// import Router from 'next/router';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import prisma from '../lib/prisma';
// import { Listbox } from '@headlessui/react'
import { useSession } from 'next-auth/react';
import { useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { users: [] } };
  }

  console.log(session)
  const user = await prisma.user.findUnique({
    where: {
      wallet: session.user.address
    },
  });

  return {
    props: { user },
  };
};

type Props = {
  user: any;
}

const UpdateUser: React.FC<Props> = (props) => {

  // console.log(props)
  const { data: session, status } = useSession();
  const [name, setName] = useState(props.user.name);
  const [email, setEmail] = useState(props.user.email);
  const [wallet, setWallet] = useState(props.user.wallet);
  // const [selectedUsers, setSelectedUsers] = useState([props.users[0]]);
  const [user, setUser] = useState(props.user);
  // const [selectedRewardRound, setSelectedRewardRound] = useState(!(props?.rewardRound[0]));
  // const [url, setUrl] = useState('');
  const { handleSubmit, formState } = useForm();

  if (!session) {
    return (
      <Layout>
        <div>Please log in</div>
      </Layout>
    )
  }

  // const setUserName = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();

  //   // console.log(user)
  //   try {
  //     const body = { user, session };
  //     await fetch('/api/post/setUserName', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(body),
  //     })
  //     // await Router.push('/');
  //     console.log('successful');
  //     await signOut({ callbackUrl: '/' })
  //     // await Router.push(url);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const updateUser = async (e: React.SyntheticEvent) => {
    // e.preventDefault();

    try {
      const body = { user, name, email, wallet };
      await fetch('/api/post/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await Router.push('/');
      console.log('successful');
      await signOut({ callbackUrl: '/' })
      // await Router.push(url);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      {session && !session?.user?.name && (
        <h1>First Time? Set Username, save & then log back in</h1>
      )}
      <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
        <form onSubmit={handleSubmit(updateUser)}>
          <h1 className="text-3xl font-bold">Update User</h1>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            value={email}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input
            autoFocus
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Ethereum Address"
            type="text"
            value={wallet}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          {/* {`w-full top-3 ${isOpen ? '': 'z-50 sticky'}`} */}
          <input className={`${formState.isSubmitting ? 'bg-black border-solid border-2 border-sky-500 rounded m-4' : 'bg-gray-200 border-solid border-2 border-sky-500 rounded m-4'}`} disabled={formState.isSubmitting} type="submit" value="Update" />
          <a className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>

    </Layout>
  );
};

export default UpdateUser;
