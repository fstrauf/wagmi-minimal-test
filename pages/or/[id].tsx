import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const user = await prisma.user.findUnique({
    where: {
      wallet: String(query.session),
    },
  },
  );

  const rewardRound = await prisma.rewardRound.findUnique({
    where: {
      id: String(query?.id),      
    },
    include: {
      TeamValueAdd: {
        include: {
          team: {},
          TeamProposal: {
            where: {
              active: true,
            },
            include: {
              user: {},              
            }
          }
        }
      },  
      // Content: {
      //   include: {
      //     Vote: {
      //       where: {
      //         userId: {
      //           equals: user.id
      //         }
      //       },
      //     },
      //     ContentAuthor: {
      //       // where: {
      //       //   userId: {
      //       //     not: user.id
      //       //   }
      //       // },
      //       include: {
      //         user: {}
      //       }
      //     }
      //   }

      // }
    },
  });

  return {
    props: {
      rewardRound,
      user,
    },
  };
};

type Props = {
  user: any;
  rewardRound: any;

}

const RewardRound: React.FC<Props> = (props) => {
  const util = require('util');
  const { handleSubmit, formState } = useForm();

  const submitData = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { voteFields };
      await fetch('/api/post/valueAddVote', {
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

//preload fields with previous values
  const votePrep = props.rewardRound.TeamValueAdd.map(valueAdd => {
      return {
      ...valueAdd,
      rewardRoundID: props.rewardRound.id,
      userId: props.user.id,
      pointsSpent: 0, // util.isUndefined(content.Vote[0]?.pointsSpent) ? 0 : Number(content.Vote[0]?.pointsSpent),
      proposalNumber: valueAdd.TeamProposal.reduce((prev, current) => (prev.proposalNumber > current.proposalNumber) ? prev : current,0).proposalNumber,
      newReason: ''
    };
  });

  // console.log(votePrep)

  const [voteFields, setvoteFields] = useState(votePrep)
  const [totalVoted, setTotalVoted] = useState(votePrep.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
  const [totalReached, setTotalReached] = useState(false)

  const handleFormChange = (index, event) => {
    console.log(event)
    let data = [...voteFields];
    data[index][event.target.name] = event.target.value;
    setvoteFields(data)

    let totalVote = (data.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
    setTotalVoted(totalVote)
    if (totalVote > 100) {
      setTotalReached(true)
    } else {
      setTotalReached(false)
    }
  }

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex flex-col mb-10 m-auto'>
        <div className='grid grid-cols-2'>
          <h2 className="font-bold">Period</h2>
          <p>{props.rewardRound.monthYear}</p>
          <h2 className="font-bold">Budget</h2>
          <p>{props.rewardRound.budget}</p>
          <h2 className="font-bold">Your Vote vs. your vote budget</h2>
          <p className={`${totalReached ? 'text-red-600' : 'text-black'}`}>{totalVoted} / 100 </p>
        </div>

        <h1 className="font-bold mt-4 mb-4">points spent to be set</h1>
        <div>
          <form className='' onSubmit={handleSubmit(submitData)}>
            <div className="overflow-x-auto relative m-5">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Team
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Value Add
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Current Vote
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Your Vote
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {voteFields.map((valueAdd, index) => (
                    <tr key={valueAdd.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {valueAdd.team.name}
                      </th>
                      <td className="py-4 px-6">
                        {valueAdd.valueAdd}
                      </td>
                      <td className="py-4 px-6">
                        {valueAdd.TeamProposal[0].allocation}
                      </td>
                      <td className="py-4 px-6">
                        <input
                          name='pointsSpent'
                          placeholder='Vote'
                          type="number"
                          value={valueAdd.pointsSpent}
                          min="0"
                          onWheel={ event => event.currentTarget.blur() }
                          onChange={event => handleFormChange(index, event)}
                          className={`bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1`}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          name='newReason'
                          value={valueAdd.newReason}
                          onChange={event => handleFormChange(index, event)}
                          className={`bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1`}
                        />
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <button className={`border-solid border-2 border-sky-500 rounded m-4 ${totalReached || formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`} disabled={totalReached || formState.isSubmitting} onClick={handleSubmit(submitData)}>Submit</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RewardRound;
