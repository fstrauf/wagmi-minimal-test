import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { rewardRound, phase } = req.body;
  const contentPointsVoted = rewardRound.Content.reduce((a, v) => a = a + Number(v.pointsVote), 0)
  var authorCash:number = 0

  //Content Reward Payout
  var payout = []
  rewardRound.Content.forEach(content => {
    content.ContentAuthor.forEach(contentAuthor => {
      authorCash = content.pointsVote / contentPointsVoted * rewardRound.budget / content.ContentAuthor.length
      if(isNaN(authorCash)){ //probably a 0 somewhere in division
        authorCash = 0
      }    
      payout.push({
        userId: contentAuthor.userId,
        authorCash: authorCash,
        teamCash: 0,
        ownership: 0
      })
    })
  })

  var teamCash:number = 0
  var ownership:number = 0

  const memberVote = await prisma.memberVote.groupBy({
    by: ['teamValueAddId'],
    _sum: {
      pointsSpent: true,
    },
  })

  // console.log(groupUsers)

  // [
  //   {
  //     _sum: { pointsSpent: 100 },
  //     teamValueAddId: 'clc00n1oh00apemuf16xldcz1'
  //   },
  //   {
  //     _sum: { pointsSpent: 100 },
  //     teamValueAddId: 'clc00n1oh00atemufddgwgrsy'
  //   }
  // ]

  //Team Reward Payout
  rewardRound.TeamValueAdd.forEach(teamValue => {
    teamValue.RewardRoundTeamMember.forEach(teamMember => {

      // console.log("team allocation " +teamValue.TeamProposal[0]?.allocation)
      // console.log("allocation points " +teamMember.allocationPoints)
      // console.log("membercount " +(Number(teamValue._count.RewardRoundTeamMember)*100))

      var totalTeamSpent = memberVote.find(mv => mv.teamValueAddId === teamValue.id)

      //we always have a total of 100 points to give - should divide these by the number of voters
      teamCash = teamMember.allocationPoints/Number(totalTeamSpent._sum.pointsSpent)*teamValue.cashAllocation
      if(isNaN(teamCash)){ //probably a 0 somewhere in division
        teamCash = 0
      }
      //i need to know total points voted.
      ownership = teamValue.TeamProposal[0]?.allocation*(teamMember.allocationPoints/Number(totalTeamSpent._sum.pointsSpent))
      if(isNaN(ownership)){ //probably a 0 somewhere in division
        ownership = 0
      }

      payout.push({
        userId: teamMember.userId,
        authorCash: 0,
        teamCash: teamCash,
        ownership: ownership
      })
    })
  })

  // console.log(payout)

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

  console.log(memberPayout)

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
        phase: phase,
      }      
      
    })
  )

  const result = await prisma.$transaction(
    payCalls
  )
  res.json(result)
}