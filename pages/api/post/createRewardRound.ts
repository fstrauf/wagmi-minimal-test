import prisma from '../../../lib/prisma';
// import { Prisma } from '@prisma/client'

export default async function handle(req, res) {
  const { budget, period } = req.body;

  const rewardRound = await prisma.rewardRound.create({
    data: {
      budget: Number(budget),
      monthYear: new Date(period).toISOString().slice(0, 7),
      contentPoints: 0,
    }

  });
  
  const teams = await prisma.team.findMany({})

  var teamValueAdds = []

  teams.forEach(team => {
    teamValueAdds.push(
      prisma.teamValueAdd.create({
        data:{
          valueAdd: '',
          team: {
            connect: {
              id: team.id,
            }
          },
          rewardRound: {
            connect: {
              id: rewardRound.id,
            }
          }
        },
        
      })
    )
  })

  const result = await prisma.$transaction(
    teamValueAdds
  )

  res.json(result);

  // try {
  //   const result = await prisma.rewardRound.create({
  //     data: {
  //       budget: Number(budget),
  //       monthYear: new Date(period).toISOString().slice(0, 7),
  //       contentPoints: 0,
  //     }

  //   });
  //   res.json(result);
  // } catch (e) {
  //   if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //     // The .code property can be accessed in a type-safe manner
  //     if (e.code === 'P2002') {
  //       console.log(
  //         'A reward round for this month already exists!'
  //       )
  //     }
  //   }
  //   throw e
  // }

}
