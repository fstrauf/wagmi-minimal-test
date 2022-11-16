
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { title, selectedUsers, url, selectedRewardRound } = req.body;

  // console.log(selectedUsers)

  //first is different
  const contentAuthor = await prisma.contentAuthor.create({
    data: {
      content: {
        create: {
          description: title,
          url: url,
          rewardRound: {
            connect: {
              id: selectedRewardRound.id
            },
          },
        },
      },
      user: {
        connect: { id: selectedUsers[0].id }
      }
    },
  })
  
  // console.log(contentAuthor)

  var authorCalls = []
  selectedUsers.forEach((element, index) => {
    //first is different
    if (index > 0) {
      authorCalls.push(prisma.contentAuthor.create({
        data: {
          content: {
            connectOrCreate: {
              where: {
                id: contentAuthor.contentId,
              },
              create: {
                description: title,
                url: url,
                rewardRound: {
                  connect: {
                    id: selectedRewardRound.id
                  },
                },
              },
            },
          },
          user: {
            connect: {
              id: element.id
            }
          }
        },
      }))
    }
  })

  // console.log(selectedRewardRound.id)

  authorCalls.push(
    prisma.rewardRound.update({
      where: {
        id: selectedRewardRound.id,
      },
      data: {
        contentPoints: {
          increment: 10,
        }
      }
    })
  )

  const response = await prisma.$transaction(
    authorCalls
  )
  console.log(response)
  res.json(response);
}
