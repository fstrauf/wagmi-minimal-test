// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import { useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { users: [] } };
  }

  const users = await prisma.user.findMany({

  });
  return {
    props: { users },
  };
};

const NewRewardRound: React.FC = (props) => {
  const [budget, setBudget] = useState('');
  const [period, setPeriod] = useState(new Date());
  const { handleSubmit, formState } = useForm();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { budget, period };
      await fetch('/api/post/createRewardRound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
      console.log('reward round created');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
        <form onSubmit={submitData}>
          <h1 className="text-3xl font-bold">Reward Round</h1>
          <input
            autoFocus
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            type="text"
            value={budget}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input
            autoFocus
            onChange={(e) => setPeriod(new Date(e.target.value))}
            placeholder="Selection Period"
            type="month"
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input disabled={!budget || !period || formState.isSubmitting}
            type="submit"
            value="Create"
            className={`${formState.isSubmitting ? 'bg-black border-solid border-2 border-sky-500 rounded m-4' : 'bg-gray-200 border-solid border-2 border-sky-500 rounded m-4'}`}
          />
          <a className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default NewRewardRound;
