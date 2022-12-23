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
  const helpDate = new Date(rewardRound.monthYear)
  // const startDate = rewardRound.monthYear + '-01'
  const endDate = new Date(helpDate.getFullYear(), helpDate.getMonth()+1, 1).toISOString().slice(0, 10)
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
                contains: 'Substack',
              }
            },
            {
              property: 'Type',
              multi_select: {
                contains: 'Podcast',
              }
            },
            {
              property: 'Type',
              multi_select: {
                contains: 'Tweet',
              }
            },
            {
              property: 'Type',
              multi_select: {
                contains: 'Video',
              }
            },
            {
              property: 'Type',
              multi_select: {
                contains: 'Community Talk',
              }
            },
            {
              property: 'Type',
              multi_select: {
                contains: 'Youtube',
              }
            },
            {
              property: 'Type',
              multi_select: {
                contains: 'LinkedIn',
              }
            },
          ]
        }


      ],
    },
  });

  //content
  // title, url, users, rewardround

  const notionResult = response.results.map((result) => (
    {
      title: result.properties.Name.title[0].plain_text,
      url: result?.properties?.link?.url,
      users: result.properties.Author.people,
      type: result.properties.Type.multi_select[0].name,
      rewardRound: rewardRound.id
      // rewardRound: 'clakacvcl00fremx3581euv67'
    }
  ))

  // pass this to second function 


  // var authorCallsFirstAuthor = []
  // notionResult.forEach((element, index) => {
  //   authorCallsFirstAuthor.push(
  //     //first call will need to create
  //     prisma.contentAuthor.create({
  //       data: {
  //         content: {
  //           create: {
  //             description: element.title,
  //             url: element.url,
  //             rewardRound: {
  //               connect: {
  //                 id: element.rewardRound
  //               },
  //             },
  //           },
  //         },
  //         user: {
  //           connectOrCreate: {
  //             where: {
  //               email: element.users[0].person.email,
  //             },
  //             create: {
  //               email: element.users[0].person.email,
  //             }
  //           }
  //         }
  //       },
  //     })
  //   )    
  // })

  // authorCallsFirstAuthor.push(
  //   prisma.rewardRound.update({
  //     where: {
  //       // id: 'clakacvcl00fremx3581euv67',
  //       id: rewardRound.id,
  //     },
  //     data: {
  //       contentPoints: {
  //         increment: notionResult.length * 10,
  //       }
  //     }
  //   })
  // )

  // const contentAuthors = await prisma.$transaction(
  //   authorCallsFirstAuthor
  // )

  // // console.log(contentAuthors)

  // var authorCallsMoreAuthors = []
  // notionResult.forEach((element, contentIndex) => {
  //   if (element.users.length > 1) {
  //     element.users.forEach((user, userIndex) => {
  //       //skip first
  //       if(userIndex==0){
  //         return
  //       }
  //       authorCallsMoreAuthors.push(
  //         prisma.contentAuthor.create({
  //           data: {
  //             content: {
  //               connect: {
  //                 id: contentAuthors[contentIndex].contentId,
  //               }
  //             },
  //             user: {
  //               connectOrCreate: {
  //                 where: {
  //                   email: user.person.email,
  //                 },
  //                 create: {
  //                   email: user.person.email,
  //                 }
  //               }
  //             }
  //           }
  //         })
  //       )
  //     })
  //   }
  // })

  // const contentMoreAuthors = await prisma.$transaction(
  //   authorCallsMoreAuthors
  // )

  // // console.log(contentMoreAuthors)

  

      // const body = { notionResult };
      // await fetch('/api/post/insertNotionContent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(body),
      // });
      // await Router.push('/');
      // console.log('successful');

      res.json({notionResult})
  
}
