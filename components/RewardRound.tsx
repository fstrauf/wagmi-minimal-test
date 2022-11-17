import React from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import { useForm } from "react-hook-form";

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
      <div className="border-solid border-black" >
        <div className='grid grid-cols-2 m-4 w-1/2'>
        <h2 className="font-bold">Period</h2>
        <p>{rewardRound.monthYear}</p>
        <h2 className="font-bold">Budget</h2>
        <p>$ {String(rewardRound.budget)}</p>
        <h2 className="font-bold">ContentPoints per Voter</h2>
        <p>{String(rewardRound.contentPoints)}</p>
        <p className="col-span-2">{rewardRound.isOpen ? 'Open' : 'Closed'}</p>
        </div>

        <div class="overflow-x-auto relative m-5">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="py-3 px-6">
                  Content piece
                </th>
                <th scope="col" class="py-3 px-6">
                  Authors
                </th>
                <th scope="col" class="py-3 px-6">
                  Points Voted
                </th>
              </tr>
            </thead>
            <tbody>
              {rewardRound.Content?.map((content: any) => (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {content.description}
                  </th>
                  <td class="py-4 px-6">
                    {content.ContentAuthor.map((author: any) => (
                      <p>{author.user.name}</p>
                    ))}
                  </td>
                  <td class="py-4 px-6">
                    {content.pointsVote}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        <h1 className='text-2xl m-5'>Voting Results</h1>
        <div class="overflow-x-auto relative m-5">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="py-3 px-6">
                  Author
                </th>
                <th scope="col" class="py-3 px-6">
                  Reward
                </th>
              </tr>
            </thead>
            <tbody>
            {rewardRound.Payout?.map((payout: any) => (
                <tr key={payout.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {payout.user.name}
                  </th>
                  <td class="py-4 px-6">
                  $ {payout.cashReward}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      {session?.user && rewardRound.isOpen && (
        <>
          <button className={`border-solid border-2 border-sky-500 rounded m-4 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200' }`}
            onClick={handleSubmit(() => {
              Router.push({
                pathname: "/r/[id]",
                query: {
                  id: rewardRound.id,
                  session: session?.user?.address,
                },
              })
            })}>Vote</button>
          <button className={`border-solid border-2 border-sky-500 rounded m-4 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200' }`}
            onClick={handleSubmit(submitData)}>
            Close Reward Round for all
          </button>
        </>
      )}
      {session?.user && !rewardRound.isOpen && (
        <button className={`border-solid border-2 border-sky-500 rounded m-4 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200' }`}
          onClick={handleSubmit(openRewardRound)}>
          Open Reward Round
        </button>
      )}
      {session?.user && !rewardRound.isOpen && (
        // <button className="border-solid border-2 border-sky-500 rounded m-3"
        <button className={`border-solid border-2 border-sky-500 rounded m-4 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200' }`}
          onClick={handleSubmit(importFromNotion)}
          disabled={formState.isSubmitting} >
            
          Import from Notion
        </button>
      )}
      {session?.user && (
        <button className={`border-solid border-2 border-sky-500 rounded m-4 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200' }`}
          onClick={handleSubmit(clearRewardRound)}>
          Delete ALL reward round content
        </button>
      )}
    </div>
  );
};

export default RewardRound;
