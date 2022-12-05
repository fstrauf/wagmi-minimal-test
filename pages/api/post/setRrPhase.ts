import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { rewardRound, phase } = req.body;
  
  const response = await prisma.rewardRound.update({
    where: {
      id: rewardRound.id,
    },
    data: {
      phase: phase,
    },
  })

  res.json(response);
}
