import React from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import { useForm } from "react-hook-form";
import { Menu, Transition, Disclosure, Popover } from '@headlessui/react'
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
  TeamsProposal: any;
  TeamAllocationProposal: any;
  TeamValueAdd: any;
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
      await fetch('/api/post/clearRR', {
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

  console.log(rewardRound.TeamValueAdd)

  return (
    <div className="bg-gray-200 border-solid border-2 border-sky-500 rounded m-4">
      <div className='flex m-4 justify-between'>
        <div className='grid grid-cols-2 w-1/2'>
          <h2 className="font-bold">Period</h2>
          <p>{rewardRound.monthYear}</p>
          <h2 className="font-bold">Budget</h2>
          <p>$ {String(rewardRound.budget)}</p>
          {/* <h2 className="font-bold">ContentPoints per Voter</h2>
          <p>{String(rewardRound.contentPoints)}</p> */}
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
                      pathname: "/or/[id]",
                      query: {
                        id: rewardRound.id,
                        session: session?.user?.address,
                      },
                    })
                  })}
                  disabled={!rewardRound.isOpen || !session?.user}>
                  New Proposal / Veto
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
                          Delete this reward round
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-3/4 m-auto border-b border-gray-400"></div>
        </div>
      </div>
      <table className="m-auto mb-5 w-5/6 text-sm text-left text-gray-500 table-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="py-1 px-3 w-1/6">
              Team
            </th>
            <th scope="col" className="py-1 px-3 w-3/6">
              Value Add
            </th>
            <th scope="col" className="py-1 px-3 w-1/6">
              Current Proposal
            </th>
            <th scope="col" className="py-1 px-3 w-1/6">
              Past Proposals
            </th>
          </tr>
        </thead>
        <tbody>
          {rewardRound.TeamValueAdd.map((teamValueAdd: any) => (
            <tr key={teamValueAdd.id} className="bg-white border-b bg-gray-800 border-gray-700">
              <th scope="row" className="py-2 px-4 font-medium text-gray-900 text-white">
                {teamValueAdd.team.name}
              </th>
              <td className="py-2 px-4">
                <textarea id="message" rows="4" class="block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  {teamValueAdd.valueAdd}
                </textarea>
              </td>
              <td className="py-2 px-4">
                {teamValueAdd?.TeamProposal[0].allocation}%
              </td>
              <td>
                <div className="w-full max-w-sm px-4">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-gray-500 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span>Details</span>
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute z-10 mt-3">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="relative grid gap-8 bg-white p-7">

                                {teamValueAdd?.TeamProposal?.slice(1).map((proposal: any) => (
                                  <div
                                    key={proposal.id}
                                    className="rounded-lg p-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                  >
                                    <div className="ml-4">
                                      <p className="text-sm text-black font-bold">
                                        {proposal.allocation}%
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {proposal.reason}
                                      </p>

                                      <p className="text-sm text-gray-500">
                                        {proposal.user.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {proposal.submittedOn}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardRound;
