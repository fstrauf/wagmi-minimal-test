// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useForm } from "react-hook-form";
import {sendDiscordUpdate} from '../lib/discordUpdate'

const NewRewardRound: React.FC = () => {
  const [budget, setBudget] = useState('');
  const [period, setPeriod] = useState(new Date());
  const { handleSubmit, formState } = useForm();

  const submitData = async (e: React.SyntheticEvent) => {
    var expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 3)
    
    // e.preventDefault();
    try {
      const body = { budget, period };
      await fetch('/api/post/createRewardRound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
      console.log('reward round created');
      sendDiscordUpdate(`***New Reward Round ${period.toISOString().slice(0, 7)} has been created:*** \n 
        1. Make sure your content for ${period.toISOString().slice(0, 7)} is in the content calendar https://tokenomicsdao.notion.site/e069a501d7ec4364a5d949bf6a8fbc83?v=b2b8ca583f3845a493f8635032b877d7 \n\n
        2. Discuss team value add with team members and add on the tool \n\n
        Next phase starts: <t:${Math.floor(Number(expiryDate)/1000)}:d>`)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex mb-10 m-auto'>
        <form onSubmit={handleSubmit(submitData)}>
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
