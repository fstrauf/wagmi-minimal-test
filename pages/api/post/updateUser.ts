
import { create } from 'domain';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { user, session } = req.body;

  // console.log(req.body)

  // var email = 
  
  const response = await prisma.user.create({
    data: {
      name: user,
      wallet: session.user.address,
    },
  })

  res.json(response);
}
