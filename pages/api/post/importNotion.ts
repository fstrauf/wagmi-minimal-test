// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from "@notionhq/client"
// import type { Readable } from 'node:stream';
// import prisma from '../../../lib/prisma'
// import { start } from 'repl'
// import { connect } from 'http2'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { rewardRound } = req.body;

  // console.log(rewardRound)

  const notion = new Client({
    auth: process.env.NOTION_TOKEN
  })

  const startDate = new Date(rewardRound.monthYear).toISOString().slice(0, 10)
  console.log("🚀 ~ file: importNotion.ts:27 ~ startDate", startDate)
  const helpDate = new Date(rewardRound.monthYear)
  // const startDate = rewardRound.monthYear + '-01'
  const endDate = new Date(helpDate.getFullYear(), helpDate.getMonth()+1, 1).toISOString().slice(0, 10)
  console.log("🚀 ~ file: importNotion.ts:31 ~ endDate", endDate)
  // console.log(endDate)

  const databaseId = 'e069a501d7ec4364a5d949bf6a8fbc83';
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'Published / Scheduled ✨',
          },
        },
        {
          property: "Publication Date",
          date: {
            on_or_after: startDate
          }
        },
        {
          property: "Publication Date",
          date: {
            on_or_before: endDate
          }
        },
        {
          or: [
            {
              property: 'Type',
              multi_select: {
                contains: 'rewards rounds',
              }
            },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'Podcast',
            //   }
            // },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'Tweet',
            //   }
            // },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'Video',
            //   }
            // },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'Community Talk',
            //   }
            // },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'YouTube',
            //   }
            // },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'LinkedIn',
            //   }
            // },
            // {
            //   property: 'Type',
            //   multi_select: {
            //     contains: 'thub template',
            //   }
            // },
          ]
        }


      ],
    },
  });
  console.log("🚀 ~ file: importNotion.ts:112 ~ response", response)

  //content
  // title, url, users, rewardround

  const notionResult = response.results.map((result) => (
    {
      title: result.properties.Name.title[0].plain_text,
      url: result?.properties['published link']?.url || '',
      users: result.properties.Author.people,
      type: result.properties.Type.multi_select[0].name,
      rewardRound: rewardRound.id
      // rewardRound: 'clakacvcl00fremx3581euv67'
    }
  ))

      console.log("🚀 ~ file: importNotion.ts:236 ~ notionResult", notionResult)
      res.json({notionResult})
      
  
}
