import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const teamValue = await prisma.teamValueAdd.findUnique({
    where: {
      id: String(query?.id),
    },
    include: {
      team: {},
    }
  });

  return {
    props: {
      teamValue,
      // user,
    },
  };
};

type Props = {
  // user: any;
  teamValue: any;

}

const TeamValueAdd: React.FC<Props> = (props) => {
  // const util = require('util');
  const { handleSubmit, formState } = useForm();
  const [valueAdd, setValueAdd] = useState(props?.teamValue?.valueAdd);
  const [budget, setBudget] = useState(props?.teamValue?.cashAllocation);

  console.log(props)

  const vaueAddId = props.teamValue.id

  const submitData = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { valueAdd, vaueAddId, budget };
      await fetch('/api/post/updateValueAdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
      console.log('successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h1>Team: {props.teamValue?.team?.name}</h1>
      <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
        <form onSubmit={handleSubmit(submitData)}>
          <h1 className="text-3xl font-bold">Value Add</h1>
          <textarea
            autoFocus
            onChange={(e) => setValueAdd(e.target.value)}
            placeholder="Description"
            rows={10}
            value={valueAdd}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input
            autoFocus
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            type="text"
            value={budget}
            className="relative m-2 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          />
          <input className={`${formState.isSubmitting ? 'bg-black border-solid border-2 border-sky-500 rounded m-4' : 'bg-gray-200 border-solid border-2 border-sky-500 rounded m-4'}`} disabled={!valueAdd || formState.isSubmitting} type="submit" value="Create" />
          <a className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default TeamValueAdd;
