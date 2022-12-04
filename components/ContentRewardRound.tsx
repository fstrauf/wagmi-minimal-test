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
  Vote: any;
};

const ContentRewardRound: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  const { data: session } = useSession();
  const { handleSubmit, formState } = useForm();

  return (
    <div className="bg-gray-200 border-solid border-2 border-dao-red rounded mt-5">
      <h1 className="text-3xl font-bold text-left m-4">Content Reward Rounds (choose one to vote)</h1>
      <div className='flex m-4 justify-between'>
        <div className='grid grid-cols-2 w-1/2'>

          <h2 className="font-bold">Budget</h2>
          <p>$ {String(rewardRound.budget)}</p>
          <h2 className="font-bold">ContentPoints per Voter</h2>
          <p>{String(rewardRound.contentPoints)}</p>
        </div>
        <div className='ml-4'>
          <div className="w-56 text-right">
            <button className={`inline-flex w-full justify-center rounded-md bg-dao-green px-4 py-2 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mt-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
              onClick={handleSubmit(() => {
                Router.push({
                  pathname: "/vote/[id]",
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
        </div>
      </div>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-3/4 m-auto border-b border-gray-400"></div>
        </div>
      </div>
      <div className='flex flex-col-reverse m-5 justify-evenly lg:flex-row'>
        <div className="overflow-x max-w-2xl">
          <table className="m-auto text-sm text-left text-gray-500 table-auto overflow-scroll w-full block">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
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
                {/* <th scope="col" className="py-1 px-3">
                  Points Voted
                </th> */}
              </tr>
            </thead>
            <tbody>
              {rewardRound.Content?.map((content: any) => (
                <tr key={content.id} className="border-b bg-gray-800 border-gray-700">
                  <th scope="row" className="py-2 px-4 font-medium w-1/2 text-white">
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
                  {/* <td className="py-2 px-4">
                    {content.pointsVote}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-around mb-10 lg:flex-col lg:justify-between'>
          <div className=''>
            <h1 className='text-2xl'>Voters</h1>
            {rewardRound?.Vote?.map((vote: any) => (
              <div key={vote.id} className="flex items-center space-x-3">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                <div key={vote.id}>{vote.user.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentRewardRound;
