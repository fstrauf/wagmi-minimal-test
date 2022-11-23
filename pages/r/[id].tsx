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

  const rewardRound = await prisma.rewardRound.findUnique({
    where: {
      id: String(query?.id),      
    },
    include: {
      Content: {
        include: {
          Vote: {
            where: {
              userId: {
                equals: user.id
              }
            },
          },
          ContentAuthor: {
            // where: {
            //   userId: {
            //     not: user.id
            //   }
            // },
            include: {
              user: {}
            }
          }
        }

      }
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
    e.preventDefault();
    try {
      const body = { voteFields };
      await fetch('/api/post/vote', {
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

  // console.log(props.rewardRound)
  

  const votePrep = props.rewardRound?.Content?.map(content => {

    var AuthorIsVoter = false
    const found = content.ContentAuthor.find(author => {
      return author.userId === props.user.id
    });
    // console.log(found)
    if(found===undefined){
      AuthorIsVoter=false
    }else{
      AuthorIsVoter=true
    }

    return {
      ...content,
      // rewardRoundID: props.rewardRound.id,
      userId: props.user.id,
      AuthorIsVoter: AuthorIsVoter,
      pointsSpent: util.isUndefined(content.Vote[0]?.pointsSpent) ? 0 : Number(content.Vote[0]?.pointsSpent),
      // voteId: props.rewardRound.Vote[index]?.id
    };
  });

  // console.log(votePrep)

  const [voteFields, setvoteFields] = useState(votePrep)
  const [totalVoted, setTotalVoted] = useState(votePrep.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
  const [totalReached, setTotalReached] = useState(false)

  const handleFormChange = (index, event) => {
    let data = [...voteFields];
    data[index][event.target.name] = event.target.value;
    setvoteFields(data)

    let totalVote = (data.reduce((a, v) => a = a + Number(v.pointsSpent), 0))
    setTotalVoted(totalVote)
    if (totalVote > Number(props.rewardRound.contentPoints)) {
      setTotalReached(true)
    } else {
      setTotalReached(false)
    }
  }

  // console.log(voteFields)

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex flex-col mb-10 m-auto'>
        <div className='grid grid-cols-2'>
          <h2 className="font-bold">Period</h2>
          <p>{props.rewardRound.monthYear}</p>
          <h2 className="font-bold">Budget</h2>
          <p>{props.rewardRound.budget}</p>
          <h2 className="font-bold">Your Vote vs. your vote budget</h2>
          <p className={`${totalReached ? 'text-red-600' : 'text-black'}`}>{totalVoted}/{props.rewardRound.contentPoints}</p>
        </div>

        <h1 className="font-bold mt-4 mb-4">points spent to be set</h1>
        <div>
          <form className='' onSubmit={handleSubmit(submitData)}>
            <div class="overflow-x-auto relative m-5">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="py-3 px-6">
                      Content piece (+link)
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Authors
                    </th>
                    <th scope="col" class="py-3 px-6">
                      Type
                    </th>
                    <th scope="col" class="py-3 px-6">
                      Your Vote
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {voteFields.map((input, index) => (
                    <tr key={input.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <a className='hover:underline' href={input.url}>
                          {input.description}
                        </a>
                      </th>
                      <td className="py-4 px-6">
                        {input.ContentAuthor.map((author: any) => (
                          <p key={author.id}>{author.user.name}</p>
                        ))}
                      </td>
                      <td class="py-4 px-6">
                        {input.type}
                      </td>
                      <td class="py-4 px-6">
                        <input
                          name='pointsSpent'
                          placeholder='Vote'
                          type="number"
                          disabled={input.AuthorIsVoter}
                          value={input.pointsSpent}
                          min="0"
                          onWheel={ event => event.currentTarget.blur() }
                          onChange={event => handleFormChange(index, event)}
                          class={`bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 ${input.AuthorIsVoter ? 'bg-red-200' : 'bg-gray-200'}`}
                        />
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <button className={`border-solid border-2 border-sky-500 rounded m-4 ${totalReached || formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`} disabled={totalReached || formState.isSubmitting} onClick={submitData}>Submit</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RewardRound;
