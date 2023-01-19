
// import { create } from 'domain';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { userName, userId } = req.body;
  

  // console.log(req.body)

  // var email = 
  
  const response = await prisma.user.upsert({
    where: {
      id: userId
    },
    update: {
      id: userId,
      name: userName,
    },
    create: {
      id: userId,
      name: userName,
    }
  })

  res.json(response);
}
