import React from 'react';
// import Router from "next/router";
// import { useSession } from 'next-auth/react';
// import { useForm } from "react-hook-form";
import { Disclosure } from '@headlessui/react'

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
  phase: any;
};

const StatusControl: React.FC<{ rewardRound: RewardRoundProps }> = ({ rewardRound }) => {
  
  var phasePrep = `bg-dao-green`
  if (rewardRound.phase === 'preparation') {
    phasePrep = `bg-dao-red`
  }
  var phaseOpen = `bg-dao-green`
  if (rewardRound.phase === 'open') {
    phaseOpen = `bg-dao-red`
  }
  var phaseTeamVote = `bg-dao-green`
  if (rewardRound.phase === 'memberVote') {
    phaseTeamVote = `bg-dao-red`
  }
  var phaseClosed = `bg-dao-green`
  if (rewardRound.phase === 'closed') {
    phaseClosed = `bg-dao-red`
  }

  return (
    <>
      <div className="w-full m-auto">
        <div className="m-auto max-w-md rounded-2xl flex flex-col">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className={`flex w-2/4 mb-1 place-self-center justify-between rounded-lg ${phasePrep} px-4 py-2 text-left text-sm font-medium text-white hover:opacity-40 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75`}>
                  <span>1. preparation</span>
                  <ChevronIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-gray-500">
                  <pre className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    1.1 Make sure your content is in the content calendar<br></br>
                    1.2 Discuss team value add with team members and add on the tool
                  </pre>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className={`flex w-2/4 mb-1 place-self-center justify-between rounded-lg ${phaseOpen} px-4 py-2 text-left text-sm font-medium text-white hover:opacity-40 focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75`}>
                  <span>2. open</span>
                  <ChevronIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-gray-500">
                  <pre className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    2.1 Vote on the content reward round<br />
                    2.2 Lets find consensus on which team added how much value by using Proposals/Vetos<br />
                    2.3 Add yourself and your team value add to each team to contributed to<br />
                  </pre>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className={`flex w-2/4 mb-1 place-self-center justify-between rounded-lg ${phaseTeamVote} px-4 py-2 text-left text-sm font-medium text-white hover:opacity-40 focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75`}>
                  <span>3. team vote</span>
                  <ChevronIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-gray-500">
                  <pre className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    3.1 Lets find consensus on how much each individual contributed to each team
                  </pre>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className={`flex w-2/4 mb-1 place-self-center justify-between rounded-lg ${phaseClosed} px-4 py-2 text-left text-sm font-medium text-white hover:opacity-40 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75`}>
                  <span>4. closed</span>
                  <ChevronIcon
                    className={`${open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-2 pb-2 text-sm text-gray-500">
                  <pre className="whitespace-pre-line block p-2.5 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    Reward round is closed and will be paid out.
                  </pre>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </>
  )
};

export default StatusControl;

function ChevronIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
  )
}