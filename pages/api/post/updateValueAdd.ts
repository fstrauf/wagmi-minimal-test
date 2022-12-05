
// import { create } from 'domain';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { valueAdd, vaueAddId, budget } = req.body;

  // console.log(req.body)

  // var email = 
  
  const response = await prisma.teamValueAdd.update({
    where: {
      id: vaueAddId,
    },
    data: {
      valueAdd: valueAdd,
      cashAllocation: Number(budget),
    },
  })

  res.json(response);
}
