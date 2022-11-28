import React from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import { useForm } from "react-hook-form";
// import { Menu } from '@headlessui/react'
// import Options from './Options';
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

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
};


const RewardRound: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  const { data: session } = useSession();
  const { handleSubmit, formState } = useForm();

  // console.log(session)


  const submitData = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/closeRewardRound', {
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

  const openRewardRound = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { rewardRound };
      await fetch('/api/post/openRewardRound', {
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
      await fetch('/api/post/clearDB', {
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
    <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4">
      <div className='flex m-4 justify-between'>
        <div className='grid grid-cols-2 w-1/2'>
          <h2 className="font-bold">Period</h2>
          <p>{rewardRound.monthYear}</p>
          <h2 className="font-bold">Budget</h2>
          <p>$ {String(rewardRound.budget)}</p>
          <h2 className="font-bold">ContentPoints per Voter</h2>
          <p>{String(rewardRound.contentPoints)}</p>
          <p className="col-span-2">{rewardRound.isOpen ? 'Open' : 'Closed'}</p>
        </div>
        <div className='ml-4'>
          <div className="w-56 text-right">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  Options
                </Menu.Button>
                <button className={`inline-flex w-full justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mt-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
                  onClick={handleSubmit(() => {
                    Router.push({
                      pathname: "/r/[id]",
                      query: {
                        id: rewardRound.id,
                        session: session?.user?.address,
                      },
                    })
                  })}
                  disabled={!rewardRound.isOpen || !session?.user}>
                  Vote
                </button>
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
                        <button className={`${active ? 'bg-sky-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                          onClick={handleSubmit(submitData)}
                          disabled={!session?.user?.isAdmin || !rewardRound.isOpen}>
                          Close Reward Round for all
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`${active ? 'bg-sky-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                          onClick={handleSubmit(openRewardRound)}
                          disabled={!session?.user?.isAdmin || rewardRound.isOpen}>
                          Open Reward Round
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`${active ? 'bg-sky-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                          onClick={handleSubmit(importFromNotion)}
                          disabled={formState.isSubmitting || !session?.user?.isAdmin || rewardRound.isOpen} >
                          Import from Notion
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`${active ? 'bg-sky-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : ''}`}
                          onClick={handleSubmit(clearRewardRound)}
                          disabled={!session?.user?.isAdmin}>
                          Delete ALL reward content
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {/* <button className={`border-solid border-2 border-sky-500 rounded m-1 text-sm p-1 disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
          onClick={handleSubmit(() => {
            Router.push({
              pathname: "/r/[id]",
              query: {
                id: rewardRound.id,
                session: session?.user?.address,
              },
            })
          })}
          disabled={!rewardRound.isOpen || !session?.user}>
          Vote
        </button> */}
          {/* {session?.user?.isAdmin && rewardRound.isOpen && ( */}
          {/* <button className={`border-solid border-2 border-sky-500 rounded m-1 text-sm p-1 disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
          onClick={handleSubmit(submitData)}
          disabled={!session?.user?.isAdmin || !rewardRound.isOpen}>
          Close Reward Round for all
        </button> */}
          {/* )} */}
          {/* {session?.user?.isAdmin && !rewardRound.isOpen && ( */}
          {/* <> */}
          {/* <button className={`border-solid border-2 border-sky-500 rounded m-1 text-sm p-1 disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
          onClick={handleSubmit(openRewardRound)}
          disabled={!session?.user?.isAdmin || rewardRound.isOpen}>
          Open Reward Round
        </button> */}
          {/* <button className={`border-solid border-2 border-sky-500 rounded m-1 text-sm p-1 disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
          onClick={handleSubmit(importFromNotion)}
          disabled={formState.isSubmitting || !session?.user?.isAdmin || rewardRound.isOpen} >
          Import from Notion
        </button> */}
          {/* </> */}
          {/* )} */}
          {/* {session?.user?.isAdmin && ( */}
          {/* <button className={`border-solid border-2 border-sky-500 rounded m-1 text-sm p-1 disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
          onClick={handleSubmit(clearRewardRound)}
          disabled={!session?.user?.isAdmin}>
          Delete ALL reward round content
        </button> */}
          {/* )} */}
        </div>
      </div>
      <div class="relative py-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-3/4 m-auto border-b border-gray-400"></div>
        </div>
      </div>
      <div className='flex flex-col-reverse m-5 justify-evenly lg:flex-row'>
        <div className="overflow-x-auto relative">
          {/* <h1 className='text-2xl mb-2'>All Content</h1> */}
          <table className="m-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="py-1 px-3">
                  Content piece
                </th>
                <th scope="col" className="py-1 px-3">
                  Type
                </th>
                <th scope="col" className="py-1 px-3">
                  Authors
                </th>
                <th scope="col" className="py-1 px-3">
                  Points Voted
                </th>
              </tr>
            </thead>
            <tbody>
              {rewardRound.Content?.map((content: any) => (
                <tr key={content.id} className="bg-white border-b bg-gray-800 border-gray-700">
                  <th scope="row" className="py-2 px-4 font-medium text-gray-900 whitespace-nowrap text-white">
                    {content.description}
                  </th>
                  <td className="py-2 px-4">
                    {content.type}
                  </td>
                  <td className="py-2 px-4">
                    {content.ContentAuthor.map((author: any) => (
                      <p key={author.id}>{author.user.name}</p>
                    ))}
                  </td>
                  <td className="py-2 px-4">
                    {content.pointsVote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-around mb-10 lg:flex-col lg:justify-between'>
          <div className=''>
            <h1 className='text-2xl'>Voters</h1>
            {rewardRound?.Vote?.map((vote: any) => (
              <div key={vote.id} class="flex items-center space-x-3">
                <svg class="flex-shrink-0 w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                <div key={vote.id}>{vote.user.name}</div>
              </div>
            ))}
          </div>
          <div>
            <h1 className='text-2xl'>Voting Results</h1>
            <div className="mt-2">
              <table className="text-sm text-left text-gray-400">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50 bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="py-2 px-2">
                      Author
                    </th>
                    <th scope="col" className="py-2 px-2">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rewardRound.Payout?.map((payout: any) => (
                    <tr key={payout.id} className="bg-white border-b bg-gray-800 border-gray-700">
                      <th scope="row" className="py-1 px-2 font-sm text-gray-900 whitespace-nowrap text-white">
                        {payout.user.name}
                      </th>
                      <td className="py-1 px-2">
                        $ {Number((payout.cashReward).toFixed(2)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RewardRound;
