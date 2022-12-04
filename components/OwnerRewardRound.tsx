import React from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import { useForm } from "react-hook-form";
import { Transition, Popover } from '@headlessui/react'
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
  RewardRoundTeamMember: any;
};


const OwnerRewardRound: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  const { data: session } = useSession();
  const { handleSubmit, formState } = useForm();

  // console.log(rewardRound)

  return (
    <div className="bg-gray-200 border-solid border-2 border-gray-400 rounded">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold text-center m-4">Ownership Reward Round</h1>
        <div className='flex m-4 justify-between'>
          <div className='ml-4'>
            <div className="w-56 text-right">
              <button className={`inline-flex w-full justify-center rounded-md bg-dao-green px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mt-2 disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
                onClick={handleSubmit(() => {
                  Router.push({
                    pathname: "/teamProposal/[id]",
                    query: {
                      id: rewardRound.id,
                      session: session?.user?.address,
                    },
                  })
                })}
                disabled={!rewardRound.isOpen || !session?.user}>
                New Proposal / Veto
              </button>
              <button className={`inline-flex w-full justify-center rounded-md bg-dao-green px-4 py-2 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mt-2 text-sm disabled:opacity-40 ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
                onClick={handleSubmit(() => {
                  Router.push({
                    pathname: "/teamAssignment/[id]",
                    query: {
                      id: rewardRound.id,
                      session: session?.user?.address,
                    },
                  })
                })}
                disabled={!rewardRound.isOpen || !session?.user}>
                Team Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-3/4 m-auto border-b border-gray-400"></div>
        </div>
      </div>
      <div className='p-5'>
        <table className="m-auto p-5 w-full text-sm text-left text-gray-500 table-auto">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="py-1 px-3 w-1/6 text-center">
                Team (click to edit)
              </th>
              <th scope="col" className="py-1 px-3 w-3/6 text-center">
                Value Add
              </th>
              <th scope="col" className="py-1 px-3 w-1/6 text-center">
                Current Proposal
              </th>
              <th scope="col" className="py-1 px-3 w-1/6 text-center">
                Past Proposals
              </th>
            </tr>
          </thead>
          <tbody>
            {rewardRound.TeamValueAdd.map((teamValueAdd: any) => (
              <>
                <tr key={teamValueAdd.id} className="border-none bg-gray-800 border-gray-700">
                  <th scope="row" className="py-2 px-4 font-medium text-white">
                    <button className='group inline-flex items-center rounded-md bg-dao-green px-3 py-2 text-xs font-medium text-white hover:hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                      onClick={handleSubmit(() => {
                        Router.push({
                          pathname: "/t/[id]",
                          query: {
                            id: teamValueAdd.id,
                            session: session?.user?.address,
                          },
                        })
                      })}
                    >
                      {teamValueAdd.team.name}
                    </button>
                  </th>
                  <td className="py-2 px-4">
                    <pre id="message" className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      {teamValueAdd.valueAdd}
                    </pre>
                  </td>
                  <td className="py-2 px-4 flex flex-col text-center place-items-center">
                    <p className='font-bold text-white'>{teamValueAdd?.TeamProposal[0]?.allocation}%</p>
                    <p>({teamValueAdd?.TeamProposal[0]?.reason})</p>
                  </td>
                  <td>
                    <div className="">
                      <Popover className="relative">
                        {({ open }) => (
                          <>
                            <Popover.Button
                              className={`
                                ${open ? '' : 'text-opacity-90'}
                                group inline-flex items-center rounded-md bg-dao-green px-3 py-2 text-sm font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
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
                                  <div className="relative grid gap-2 bg-white p-2">

                                    {teamValueAdd?.TeamProposal?.slice(1).map((proposal: any) => (
                                      <div
                                        key={proposal.id}
                                        className="rounded-lg p-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                      >
                                        <div className="ml-4">
                                          <p className="text-sm text-black font-bold">
                                            {proposal.allocation}%
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {new Date(proposal.submittedOn).toISOString().slice(0, 10)}
                                          </p>
                                          <p className="text-sm text-gray-900">
                                            ({proposal.reason})
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {proposal.user.name}
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
                <tr key={teamValueAdd.valueAdd} className="border-b bg-gray-800 border-gray-700">
                  <td colSpan={3} className="py-2 px-4">
                    <p className='font-bold text-white'>Members:</p>
                    <div className='flex'>
                      {teamValueAdd?.RewardRoundTeamMember?.map((member: any) => (
                        <div className='flex ml-4'>
                          <Popover className="relative">
                            {({ open }) => (
                              <>
                                <Popover.Button
                                  className={`
                                ${open ? '' : 'text-opacity-90'}
                                group inline-flex items-center rounded-md bg-dao-green px-3 py-2 text-xs font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                  <span>{member.user.name}</span>
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
                                      <div className="relative grid gap-2 bg-white p-2">
                                        <pre id="message" className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                          {member.valueAdd}
                                        </pre>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>

                        </div>
                      ))}
                    </div>
                  </td>
                  <td colSpan={1}>
                    <button className='px-4 group inline-flex items-center rounded-md bg-dao-green py-2 text-xs font-medium text-white hover:hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                      onClick={handleSubmit(() => {
                        Router.push({
                          pathname: "/teamVote/[id]",
                          query: {
                            id: teamValueAdd.id,
                            session: session?.user?.address,
                          },
                        })
                      })}
                    >
                      Team Vote
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerRewardRound;
