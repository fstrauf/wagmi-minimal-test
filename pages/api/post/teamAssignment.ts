import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;
  var voteCalls = []
  // var delCalls = []

  // console.log(voteFields)

  // prisma.rewardRoundTeamMember.deleteMany({
  //   where: {
  //     userId: voteFields[0]?.userId,
  //     AND: {
  //       teamValueAddId: 
  //     },
  //   },
  // })

  // voteCalls.push(
  //   prisma.rewardRoundTeamMember.upsert({
  //     where: {

  //     }

  //   })
  // )

  voteFields.forEach(element => {
    // delCalls.push(
    //   prisma.rewardRoundTeamMember.deleteMany({
    //     where: {
    //       userId: element.userId,
    //       AND: {
    //         teamValueAddId: element.id,
    //       }
    //     }
    //   })
    // )
    voteCalls.push(
      prisma.rewardRoundTeamMember.upsert({
        where: {
          id: element.RewardRoundTeamMemberId,
        },
        update: {
          valueAdd: element.valueAdd,
          selected: element.checked,
        },
        create: {
          valueAdd: element.valueAdd,
          selected: element.checked,
          user: {
            connect: {
              id: element.userId
            }
          },
          teamValueAdd: {
            connect: {
              id: element.id
            }
          }
        },
      })
    )
  });

  const result = await prisma.$transaction(
    // delCalls,
    voteCalls,
  )

  console.log(result)
  res.json(result)

}