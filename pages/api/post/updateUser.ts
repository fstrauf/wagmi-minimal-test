
// import { create } from 'domain';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { user, name, email, wallet, authorClerkId } = req.body;
  

  // console.log(req.body)

  // var email = 
  
  const response = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: name,
      wallet: wallet,
      email: email,
      id: authorClerkId,
    },
  })

  res.json(response);
}
