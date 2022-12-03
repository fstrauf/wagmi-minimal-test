import React, { use, useState } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Layout from '../../components/Layout';
// import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import { useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const user = await prisma.user.findUnique({
    where: {
      wallet: String(query.session),
    },
  },
  );

  const teamValueAdd = await prisma.teamValueAdd.findUnique({
    where: {
      id: String(query?.id),
    },
    include: {
      team: {},
      RewardRoundTeamMember: {
        include: {
          user: {},
          MemberVote: {
            where: {
              userId: {
                equals: user.id,
              }
            }
          },
        }
      },
      rewardRound: {},
    },
  });

  return {
    props: {
      teamValueAdd,
      user,
    },
  };
};

type Props = {
  user: any;
  teamValueAdd: any;
}

const TeamVote: React.FC<Props> = (props) => {
  const util = require('util');
  const { handleSubmit, formState } = useForm();

  const submitData = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { voteFields };
      await fetch('/api/post/teamMemberVote', {
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

  const votePrep = props.teamValueAdd?.RewardRoundTeamMember?.map(member => {
    return {
      ...member,
      // rewardRoundID: props.rewardRound.id,
      userId: props.user.id,
      // AuthorIsVoter: AuthorIsVoter,
      pointsSpent: util.isUndefined(member.MemberVote[0]?.pointsSpent) ? 0 : Number(member.MemberVote[0]?.pointsSpent),
      // voteId: props.rewardRound.Vote[index]?.id
    };
  });

  const votingPoints = 100
  const [voteFields, setvoteFields] = useState(votePrep)
  const [totalVoted, setTotalVoted] = useState(votePrep?.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
  const [totalReached, setTotalReached] = useState(false)

  const handleFormChange = (index, event) => {
    let data = [...voteFields];
    data[index][event.target.name] = event.target.value;
    setvoteFields(data)

    let totalVote = (data.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
    setTotalVoted(totalVote)
    if (totalVote > Number(votingPoints)) {
      setTotalReached(true)
    } else {
      setTotalReached(false)
    }
  }

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex flex-col mb-10 m-auto'>
        {/* <div className=''> */}
        {/* <h2 className="font-bold">Period</h2> */}
        <div className='col-span-2 flex mb-10 justify-self-center'>
          <p className='font-bold mr-5 text-2xl'>{props.teamValueAdd?.rewardRound?.monthYear}</p>
          <p className='font-bold text-2xl'>{props.teamValueAdd?.team?.name}</p>
        </div>
        <h2 className="font-bold">Team Value Add</h2>
        <pre className='whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'>{props.teamValueAdd?.valueAdd}</pre>
        <h2 className="font-bold">Budget</h2>
        <p>$ {props.teamValueAdd?.cashAllocation}</p>
        <h2 className="font-bold">Your Vote vs. your vote budget</h2>
        <p className={`${totalReached ? 'text-red-600' : 'text-black'}`}>{totalVoted} / {votingPoints}</p>
        {/* </div> */}

        <div>
          <form className='mt-5' onSubmit={handleSubmit(submitData)}>
            <div className="overflow-x-auto relative">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6 w-1/6">
                      Team Member
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Value Add
                    </th>
                    <th scope="col" className="py-3 px-6 w-1/6">
                      Your Vote
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {voteFields?.map((input, index) => (
                    <tr key={input.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <a className='hover:underline' href={input.url}>
                          {input.user?.name}
                        </a>
                      </th>
                      <td className="py-4 px-6">
                        <pre id="message" className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          {input.valueAdd}
                        </pre>
                      </td>
                      <td className="py-4 px-6">
                        <input
                          name='pointsSpent'
                          placeholder='Vote'
                          type="number"
                          disabled={input.AuthorIsVoter}
                          value={input.pointsSpent}
                          min="0"
                          onWheel={event => event.currentTarget.blur()}
                          onChange={event => handleFormChange(index, event)}
                          className={`bg-gray-50 w-20 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 ${input.AuthorIsVoter ? 'bg-red-200' : 'bg-gray-200'}`}
                        />
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <button className={`mt-5 inline-flex w-54 justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 
                  ${totalReached || formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
              disabled={totalReached || formState.isSubmitting}
              onClick={handleSubmit(submitData)}>Submit</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TeamVote;
