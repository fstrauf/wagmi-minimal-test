import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const user = await prisma.user.findUnique({
    where: {
      // wallet: String(query.session),
      id: String(query.session),
    },
  },
  );

  // console.log(query)

  const teamValue = await prisma.teamValueAdd.findMany({
    where: {
      rewardRoundId: String(query?.id),
    },
    include: {
      team: {},
      RewardRoundTeamMember: {
        where: {
          userId: user?.id
        }
      }
    }
  });

  return {
    props: {
      teamValue,
      user,
    },
  };
};

type Props = {
  user: any;
  teamValue: any;

}

const TeamAssignment: React.FC<Props> = (props) => {
  const util = require('util');
  const { handleSubmit, formState } = useForm();

  const submitData = async (e: React.SyntheticEvent) => {
    // e.preventDefault();
    try {
      const body = { voteFields };
      await fetch('/api/post/teamAssignment', {
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

  // console.log(props.teamValue[0].RewardRoundTeamMember)


  const votePrep = props.teamValue?.map(team => {
    return {
      ...team,
      checked: util.isUndefined(team.RewardRoundTeamMember[0]) ? false : team.RewardRoundTeamMember[0].selected,
      valueAdd: util.isUndefined(team.RewardRoundTeamMember[0]) ? '' : team.RewardRoundTeamMember[0].valueAdd,
      RewardRoundTeamMemberId: util.isUndefined(team.RewardRoundTeamMember[0]?.id) ? '' : team.RewardRoundTeamMember[0]?.id,
      userId: props?.user?.id,
    };
  });

  const [voteFields, setvoteFields] = useState(votePrep)

  // console.log(voteFields)

  const handleFormChange = (index, event) => {
    let data = [...voteFields];
    data[index][event.target.name] = event.target.value;
    setvoteFields(data)
  }

  const handleCheckBoxChange = (index, event) => {
    let data = [...voteFields];
    data[index][event.target.name] = event.target.checked;
    setvoteFields(data)
  }

  return (
    <Layout>
      <div className='max-w-5xl mt-2 flex flex-col mb-10 m-auto'>
        <h1 className="font-bold mt-4 mb-4">Select the teams you worked in and enter the value you added to the team!</h1>
        <form className='' onSubmit={handleSubmit(submitData)}>
          <div className="overflow-x-auto relative">
            <ul className="w-1/2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {voteFields.map((input, index) => (
                <li key={input.id} className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <label for="selected" class="py-3 ml-2 w-1/3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {input.team.name}
                    </label>
                    <input
                      name='checked'
                      type="checkbox"
                      // disabled={input.AuthorIsVoter}
                      checked={input.checked}
                      // min="0"
                      // onWheel={event => event.currentTarget.blur()}
                      onChange={event => handleCheckBoxChange(index, event)}
                      className="w-6 h-6 mr-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-blue-600 ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                    />
                    <textarea
                      name='valueAdd'
                      onChange={event => handleFormChange(index, event)}
                      placeholder="Description"
                      rows={4}
                      value={input.valueAdd}
                      className="relative m-2 w-full text-black cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button className={`inline-flex w-40 justify-center rounded-md bg-dao-green px-4 py-2 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mt-2 text-sm disabled:opacity-40 
            ${formState.isSubmitting ? 'bg-red-200' : 'bg-gray-200'}`}
            disabled={formState.isSubmitting}
            onClick={handleSubmit(submitData)}>
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default TeamAssignment;
