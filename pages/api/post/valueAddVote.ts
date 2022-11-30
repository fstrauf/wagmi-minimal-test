import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;

  // console.log(voteFields)
//set all others to false

  var voteCalls = []

  voteCalls.push(
    prisma.teamsProposal.updateMany({
      data: {
        active: false,
      }
    })
  )

  voteFields.forEach(element => {
    voteCalls.push(
      prisma.teamsProposal.create({
        data: {
          reason: element.newReason,
          active: true,
          allocation: Number(element.pointsSpent),
          proposalNumber: Number(element.TeamProposal[0].proposalNumber + 1),
          submittedOn: new Date,
          user: {
            connect: {
              id: element.userId,
            }
          },
          rewardRound: {
            connect: {
              id: element.rewardRoundId,
            }
          },
          teamValueAdd: {
            connect: {
              id: element.id,
            }
          }
        }
      })
    //   prisma.vote.upsert({
    //     where: {
    //       id: voteId,
    //     },
    //     create: {
    //       pointsSpent: Number(element.pointsSpent),
    //       user: {
    //         connect: {
    //           id: element.userId
    //         }
    //       },
    //       rewardRound: {
    //         connect: {
    //           id: element.rewardRoundId
    //         }
    //       },
    //       content: {
    //         connect: {
    //           id: element.id
    //         }
    //       }
    //     },
    //     update: {
    //       pointsSpent: Number(element.pointsSpent),
    //     }
    //   })
    );
  })

  const result = await prisma.$transaction(
    voteCalls
  )
  // res.json(result)

  // const pointsTest = await prisma.vote.findMany({
  //   where: {
  //     rewardRoundId: String(voteFields[0].rewardRoundId)
  //   }
  // })
  // // console.log(pointsTest)

  // const pointsUpdate = await prisma.vote.groupBy({
  //   by: ['contentId'],
  //   where: {
  //     rewardRoundId: String(voteFields[0].rewardRoundId)
  //   },
  //   _sum: {
  //     pointsSpent: true,
  //   }
  // })

  // console.log(pointsUpdate)

  // var contentCalls = []
  // pointsUpdate.forEach(element => {
  //   contentCalls.push(
  //     prisma.content.update({
  //       where: {
  //         id: String(element.contentId)
  //       },
  //       data: {
  //         pointsVote: Number(element._sum.pointsSpent)
  //       },
  //     })
  //   )
  // })

  // const result2 = await prisma.$transaction(
  //   contentCalls
  // )
  res.json(result)

}