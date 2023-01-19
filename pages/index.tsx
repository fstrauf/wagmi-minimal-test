import React from 'react';
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
import { Link } from 'react-scroll'
import RewardRound from '../components/RewardRound'
// import { useSignIn } from '@clerk/nextjs/dist/client';


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
          cashAllocation: true,
          allocation: true,
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
          RewardRoundTeamMember: {
            include: {
              user: {},
            },
            where: {
              selected: true,
            }
          },
          MemberVote: {
            distinct: ['userId'],
            include: {
              user:{},
            }
          },
          _count: {
            select: {
              RewardRoundTeamMember: true,
            }
          }
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
  // const { data: session, status } = useSession();

  // if (!session) {
  //   return (
  //     <Layout>
  //       <p>Please log in to see reward rounds</p>
  //     </Layout>
  //   )
  // }

  return (
    <Layout>
      <div className="overflow-x-scroll md:px-10 bg-white border-b-2 border-black">
        <ul className='flex'>
        {props.rewardRound.map((rewardRound) => (
          <>
          <li><Link className="flex items-center p-4 text-xs font-bold text-gray-900 hover:rounded hover:text-white hover:bg-gray-700 no-underline" activeClass="active" to={`${rewardRound.monthYear}Team`} href={`${rewardRound.monthYear}Team`} spy={true} smooth={true}>{rewardRound.monthYear} Team</Link></li>
          <li><Link className="flex items-center p-4 text-xs font-bold text-gray-900 hover:rounded hover:text-white hover:bg-gray-700 no-underline" activeClass="active" to={`${rewardRound.monthYear}Content`} href={`${rewardRound.monthYear}Content`} spy={true} smooth={true}>{rewardRound.monthYear} Content</Link></li>
          </>
        ))}
        </ul>
      </div>

      <div className="mt-2 flex flex-col mb-10 m-auto">
        {/* {session && !session?.user?.name && (
          <>
            <h1 className='text-3xl text-rose-600'>First Time? Set user details, save & then log back in</h1>
            <Link href='/updateUser' className='bg-gray-200 border-solid border-1 border-sky-500 rounded'>Update User</Link>
          </>
        )} */}
        <main>
          <div className="flex flex-col m-auto">
            {props.rewardRound.map((rewardRound) => (
              <div key={rewardRound.id} className='mb-5'>
                <RewardRound rewardRound={rewardRound} />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
