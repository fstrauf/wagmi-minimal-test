import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;
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
    );
  })

  const result = await prisma.$transaction(
    voteCalls
  )
 
  res.json(result)

}