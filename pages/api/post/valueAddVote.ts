import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { voteFields } = req.body;
  var voteCalls = []

//update value add with final proposal value

  voteCalls.push(
    prisma.teamsProposal.updateMany({
      data: {
        active: false,
      }
    })
  )

  var proposalNumber = 0

  voteFields.forEach(element => {

    if(!isNaN(Number(element.TeamProposal[0]?.proposalNumber))){
      proposalNumber = element.TeamProposal[0]?.proposalNumber
    }

    voteCalls.push(
      prisma.teamsProposal.create({
        data: {
          reason: element.newReason,
          active: true,
          allocation: Number(element.pointsSpent),
          proposalNumber: Number(proposalNumber + 1),
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