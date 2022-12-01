
// import { create } from 'domain';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { valueAdd, vaueAddId } = req.body;

  // console.log(req.body)

  // var email = 
  
  const response = await prisma.teamValueAdd.update({
    where: {
      id: vaueAddId,
    },
    data: {
      valueAdd: valueAdd,
    },
  })

  res.json(response);
}
