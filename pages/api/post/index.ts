import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { title, contentString1, contentString2, contentId } = req.body;

  console.log(contentId)
  const id = contentId ?? ''

  const result = await prisma.post.upsert({
    where: {
      id: id,
    },
    create: {
      title: title,
      content: contentString1,
      content2: contentString2,
      author: { connect: { email: 'f.strauf@gmail.com' } },
    },
    update: {
      content: contentString1,
      content2: contentString2,
    }
  });
  res.json(result);
}