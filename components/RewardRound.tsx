import React from 'react';
import ContentRewardRound from "./ContentRewardRound";
import OwnerRewardRound from "./OwnerRewardRound";
import { Menu, Transition, Disclosure, Popover } from '@headlessui/react'
import { Fragment } from 'react'
import { useForm } from "react-hook-form";
import Router from "next/router";
import { useSession } from 'next-auth/react';


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
    const { handleSubmit, formState } = useForm();
    const { data: session } = useSession();

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

    return (
        <div key={rewardRound.id} className='bg-gray-300'>
            <div className="w-56 text-right">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
            <h2 className="font-bold">Period</h2>
            <p>{rewardRound.monthYear}</p>
            <p className="col-span-2">{rewardRound.isOpen ? 'Open' : 'Closed'}</p>
            <OwnerRewardRound rewardRound={rewardRound} />
            <ContentRewardRound rewardRound={rewardRound} />
        </div>
    )
}

export default RewardRound;