import React from 'react';
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
// import Router from 'next/router';
import RewardRound from '../components/RewardRound'

export const getServerSideProps: GetServerSideProps = async () => {

  const rewardRound = await prisma.rewardRound.findMany({
    take: 3,
    include: {
      Content: {
        include: {
          ContentAuthor: {
            include: {
              user: {}
            }
          }
        }
      },
      Payout: {
        include: {
          user: {},
        }
      },
      Vote: {
        distinct: ['userId'],
        include: {
          user: {
            select: {
              name: true,
            }
          },
        }
      },
      TeamValueAdd: {
        select: {
          team: {},
          id: true,
          valueAdd: true,
          TeamProposal: {
            take: 3,
            include: {
              user: {},
            },
            orderBy: [
              {
                submittedOn: 'desc',
              }
            ]
          },
        },

      },
    },
    orderBy: [
      {
        monthYear: 'desc',
      },
    ]
  });

  return {
    props: {
      // feed,
      // payout,
      rewardRound,
    },
    // revalidate: 10,
  };
};

type Props = {
  payout: PostProps[];
  rewardRound: any;
}

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();

  return (
    <Layout>
      <div className="max-w-5xl mt-2 flex flex-col mb-10 m-auto">
        {session && !session?.user?.name && (
          <>
            <h1 className='text-3xl text-rose-600'>First Time? Set user details, save & then log back in</h1>
            <Link href='/updateUser' className='bg-gray-200 border-solid border-1 border-sky-500 rounded m-4'>Update User</Link>
          </>
        )}
        <main>
          <div className="flex flex-col">
            {props.rewardRound.map((rewardRound) => (
              <div key={rewardRound.id}>
              <RewardRound rewardRound={rewardRound} />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {/* {props.rewardRound.map((rewardRound) => (
              <div key={rewardRound.id}>
                <ContentRewardRound rewardRound={rewardRound} />
              </div>
            ))} */}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
