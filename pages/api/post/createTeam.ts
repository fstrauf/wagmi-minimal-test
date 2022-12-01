import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client'

export default async function handle(req, res) {
  const { teamName } = req.body;

  // console.log(req)

  try {
    const result = await prisma.team.create({
      data: {
        name: teamName,
      }

    });
    res.json(result);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log(
          'A reward round for this month already exists!'
        )
      }
    }
    throw e
  }

}
