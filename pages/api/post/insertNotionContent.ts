import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { notionResult } = req.body;


  var authorCallsFirstAuthor = []
  notionResult.forEach((element, index) => {
    authorCallsFirstAuthor.push(
      //first call will need to create
      prisma.contentAuthor.create({
        data: {
          content: {
            create: {
              description: element.title,
              url: element.url,
              type: element.type,
              rewardRound: {
                connect: {
                  id: element.rewardRound
                },
              },
            },
          },
          user: {
            connectOrCreate: {
              where: {
                email: element.users[0].person.email,
              },
              create: {
                email: element.users[0].person.email,
              }
            }
          }
        },
      })
    )    
  })

  authorCallsFirstAuthor.push(
    prisma.rewardRound.update({
      where: {
        // id: 'clakacvcl00fremx3581euv67',
        id: notionResult[0].rewardRound,
      },
      data: {
        contentPoints: {
          increment: notionResult.length * 10,
        }
      }
    })
  )

  const contentAuthors = await prisma.$transaction(
    authorCallsFirstAuthor
  )

  // console.log(contentAuthors)

  var authorCallsMoreAuthors = []
  notionResult.forEach((element, contentIndex) => {
    if (element.users.length > 1) {
      element.users.forEach((user, userIndex) => {
        //skip first
        if(userIndex==0){
          return
        }
        authorCallsMoreAuthors.push(
          prisma.contentAuthor.create({
            data: {
              content: {
                connect: {
                  id: contentAuthors[contentIndex].contentId,
                }
              },
              user: {
                connectOrCreate: {
                  where: {
                    email: user.person.email,
                  },
                  create: {
                    email: user.person.email,
                  }
                }
              }
            }
          })
        )
      })
    }
  })

  const contentMoreAuthors = await prisma.$transaction(
    authorCallsMoreAuthors
  )

  // console.log(contentMoreAuthors)


  res.status(200).json(notionResult)
}
