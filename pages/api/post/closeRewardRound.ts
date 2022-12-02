import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { rewardRound } = req.body;
  const contentPointsVoted = rewardRound.Content.reduce((a, v) => a = a + Number(v.pointsVote), 0)

  var payout = []
  rewardRound.Content.forEach(content => {
    content.ContentAuthor.forEach(contentAuthor => {
      payout.push({
        userId: contentAuthor.userId,
        authorCash: content.pointsVote / contentPointsVoted * rewardRound.budget / content.ContentAuthor.length,
        teamCash: 0,
        ownership: 0
      })
    })
  })

  rewardRound.TeamValueAdd.forEach(teamValue => {
    teamValue.RewardRoundTeamMember.forEach(teamMember => {
      payout.push({
        userId: teamMember.userId,
        authorCash: 0,
        teamCash: teamMember.allocationPoints/(Number(teamValue._count.RewardRoundTeamMember)*100)*teamValue.cashAllocation,
        ownership: teamValue.TeamProposal[0].allocation*(teamMember.allocationPoints/(Number(teamValue._count.RewardRoundTeamMember)*100))
      })
    })
  })

  var memberPayout = [];
  payout.reduce(function (res, value) {
    if (!res[value.userId]) {
      res[value.userId] = { userId: value.userId, authorCash: 0, teamCash: 0, ownership: 0 };
      memberPayout.push(res[value.userId])
    }
    res[value.userId].authorCash += Number(value.authorCash);
    res[value.userId].teamCash += Number(value.teamCash);
    res[value.userId].ownership += Number(value.ownership);
    return res;
  }, {});

  var payCalls = []

  memberPayout.forEach(memberPayout => {
    payCalls.push(prisma.payout.create({
      data: {
        contentCashReward: memberPayout.authorCash,
        teamCashReward: memberPayout.teamCash,
        ownershipReward: memberPayout.ownership,
        rewardRound: {
          connect: {
            id: rewardRound.id,
          }
        },
        user: {
          connect: {
            id: memberPayout.userId,
          }
        }
      },
    }))
  })

  payCalls.push(
    prisma.rewardRound.update({
      where:{
        id: rewardRound.id,
      },
      data: {
        isOpen: false,
      }      
      
    })
  )

  const result = await prisma.$transaction(
    payCalls
  )
  res.json(result)
}