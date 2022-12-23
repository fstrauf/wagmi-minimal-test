import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;
  console.log(voteFields)
  var voteCalls = []
  voteFields.forEach(element => {
    var voteId = ''
    if (element.MemberVote.length > 0) {
      voteId = element.MemberVote[0]?.id
    }
    voteCalls.push(
      prisma.memberVote.upsert({
        where: {
          id: voteId,
        },
        create: {
          pointsSpent: Number(element.pointsSpent),
          user: {
            connect: {
              id: element.userId
            }
          },
          teamValueAdd: {
            connect: {
              id: element.teamValueAddId
            }
          },
          RewardRoundTeamMember: {
            connect: {
              id: element.id
            }
          }
        },
        update: {
          pointsSpent: Number(element.pointsSpent),
        }
      })
    );
  })

  const result1 = await prisma.$transaction(
    voteCalls
  )
  // console.log(result1)

  const pointsUpdate = await prisma.memberVote.groupBy({
    by: ['RewardRoundTeamMemberId'],
    where: {
      teamValueAddId: String(voteFields[0].teamValueAddId)
    },
    _sum: {
      pointsSpent: true,
    }
  })

  // console.log(await pointsUpdate)

  var teamMemberCalls = []
  pointsUpdate.forEach(element => {
    teamMemberCalls.push(
      prisma.rewardRoundTeamMember.update({
        where: {
          id: String(element.RewardRoundTeamMemberId)
        },
        data: {
          allocationPoints: Number(element._sum.pointsSpent)
        },
      })
    )
  })

  const result2 = await prisma.$transaction(
    teamMemberCalls
  )
  res.json(result2)

}