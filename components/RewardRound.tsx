// import React from 'react';
import ContentRewardRound from "./ContentRewardRound";
import OwnerRewardRound from "./OwnerRewardRound";
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import Router from "next/router";
import { useSession } from 'next-auth/react';
import { sendDiscordUpdate } from '../lib/discordUpdate'
import StatusControl from "./StatusControl";


export type RewardRoundProps = {
  url: string;
  id: string;
  title: string;
  budget: Number;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  isOpen: boolean;
  contentPoints: Number;
  monthYear: any;
  Content: any;
  Payout: any;
  TeamsProposal: any;
  TeamAllocationProposal: any;
  TeamValueAdd: any;
  phase: any;
  Vote: any;
};

const RewardRound: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  const { handleSubmit, formState } = useForm();
  const { data: session } = useSession();
  const buttonRef = useRef();

  const closeRewardRound = async (data: any, e: React.SyntheticEvent) => {
    // const closeRewardRound = async (e: React.SyntheticEvent) => {

    e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/closeRewardRound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      buttonRef.current?.click() //dirty hack
      await Router.push('/');
      console.log('successful');
      sendDiscordUpdate(`Reward Round ${rewardRound.monthYear} has been closed - thanks for voting!`)
    } catch (error) {
      console.error(error);
    }
  };

  const openRewardRound = async (e: React.SyntheticEvent) => {
    var expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 2)
    // e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/openRewardRound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      buttonRef.current?.click() //dirty hack
      await Router.push('/');
      console.log('successful');
      sendDiscordUpdate(`**Reward Round ${rewardRound.monthYear} was just opened!** \n
        1. Vote on the content reward round \n\n
        2. Let's find consensus on which team added how much value by using Proposals/Vetos\n\n
        3. Add yourself and your team value add to each team to contributed to \n\n
        Next phase starts: <t:${Math.floor(Number(expiryDate) / 1000)}:d>`)
    } catch (error) {
      console.error(error);
    }
  };


  const startMemberVotePhase = async (e: React.SyntheticEvent) => {
    var expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 2)
    // e.preventDefault();
    try {
      const body = { rewardRound, phase: 'memberVote' };
      await fetch('/api/post/setRrPhase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      buttonRef.current?.click() //dirty hack
      await Router.push('/');
      console.log('successful');
      sendDiscordUpdate(`**Reward Round ${rewardRound.monthYear} has moved to member allocation phase!** \n        
        1. Let's find consensus on how much each individual contributed to each team.\n\n
        Reward closes: <t:${Math.floor(Number(expiryDate) / 1000)}:d>`)
    } catch (error) {
      console.error(error);
    }
  };

  const importFromNotion = async (e: React.SyntheticEvent) => {
    // e.preventDefault();

    try {
      const body = { rewardRound };
      const notionResult = await fetch('/api/post/importNotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await notionResult.json();

      await fetch('/api/post/insertNotionContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      buttonRef.current?.click() //dirty hack
      await Router.push('/');
      console.log('successful');
    } catch (error) {
      console.error(error);
    }
  };

  const clearRewardRound = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/clearRR', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      buttonRef.current?.click() //dirty hack
      await Router.push('/');
      console.log('successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={rewardRound.id} className='bg-gray-300 p-5 rounded-lg border-dao-red border-2'>
      <div className="flex justify-between mb-5">
        <p className="text-xl font-bold w-28">{rewardRound.monthYear}</p>
        {/* <p className="text-2xl col-span-2">{rewardRound.isOpen ? 'Open' : 'Closed'}</p> */}
        <StatusControl rewardRound={rewardRound}/>
        <Menu as="div" className="relative inline-block text-left">
          {/* <div> */}
          <Menu.Button ref={buttonRef} className="inline-flex w-full justify-center rounded-md bg-dao-green px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Options
          </Menu.Button>
          {/* </div> */}
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
                    <button
                      className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} 
                          group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 
                          ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                      onClick={handleSubmit(closeRewardRound)}
                      disabled={!session?.user?.isAdmin || !rewardRound.isOpen}>
                      Close Reward Round for all
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                      onClick={handleSubmit(openRewardRound)}
                      disabled={!session?.user?.isAdmin || rewardRound.isOpen}>
                      Open Reward Round
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                      onClick={handleSubmit(startMemberVotePhase)}
                      disabled={!session?.user?.isAdmin || !rewardRound.isOpen}>
                      Start member vote phase
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                      onClick={handleSubmit(importFromNotion)}
                      disabled={formState.isSubmitting || !session?.user?.isAdmin || rewardRound.isOpen} >
                      Import from Notion
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`${active ? 'bg-dao-green text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                      onClick={handleSubmit(clearRewardRound)}
                      disabled={!session?.user?.isAdmin}>
                      Delete this reward round
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-3/4 m-auto border-b border-gray-400"></div>
        </div>
      </div>
      <div className={`mb-5 ${rewardRound.isOpen ? 'collapse' : ''}`}>
        <h1 className='text-2xl'>Voting Results</h1>
        <div className="mt-2">
          <table className="text-sm text-left text-gray-400">
            <thead className="text-sm uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-2 px-2">
                  Member
                </th>
                <th scope="col" className="py-2 px-2">
                  Content Reward
                </th>
                <th scope="col" className="py-2 px-2">
                  Team Reward
                </th>
                <th scope="col" className="py-2 px-2">
                  Ownership
                </th>
              </tr>
            </thead>
            <tbody>
              {rewardRound.Payout?.map((payout: any) => (
                <tr key={payout.id} className="border-b bg-gray-800 border-gray-700">
                  <th scope="row" className="py-1 px-2 font-sm whitespace-nowrap text-white">
                    {payout.user.name}
                  </th>
                  <td className="py-1 px-2">
                    $ {Number((payout.contentCashReward)?.toFixed(2)).toLocaleString()}
                  </td>
                  <td className="py-1 px-2">
                    $ {Number((payout.teamCashReward)?.toFixed(2)).toLocaleString()}
                  </td>
                  <td className="py-1 px-2">
                    {Number((payout.ownershipReward))?.toLocaleString()} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OwnerRewardRound rewardRound={rewardRound} />
      <ContentRewardRound rewardRound={rewardRound} />
    </div>
  )
}

export default RewardRound;