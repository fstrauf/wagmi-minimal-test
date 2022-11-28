// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from "@notionhq/client"
// import type { Readable } from 'node:stream';
// import prisma from '../../../lib/prisma'
// import { start } from 'repl'
// import { connect } from 'http2'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { rewardRound } = req.body;

  // console.log(rewardRound)

  const notion = new Client({
    // auth: 'secret_fT873NOpG6vavqmsxwbhltP4s4ejsYMSJMYkz3tJpsz',
    auth: process.env.NOTION_TOKEN
  })

  // const startDate = new Date(rewardRound.monthYear).toISOString().slice(0, 10)
  // const helpDate = new Date(rewardRound.monthYear)
  // const startDate = rewardRound.monthYear + '-01'
  // const endDate = new Date(helpDate.getFullYear(), helpDate.getMonth()+1, 1).toISOString().slice(0, 10)
  // console.log(endDate)


  // https://tokenomicsdao.notion.site/d5e62dd62d654e17ae71059761ada66b?v=261826905f424254bdd91438ce8aad55
  // https://tokenomicsdao.notion.site/CitaDAO-0127446c49714a00a693a5fc5180c25a
  const databaseId = 'd5e62dd62d654e17ae71059761ada66b'
  const pageId ='f84245f1-bf77-4a27-a174-744e7d43003d'
  // const response = await notion.databases.query({
  //   database_id: databaseId,
  // });

  // const response = await notion.pages.retrieve({ page_id: pageId });
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });

  console.log(response)

      res.json({response})
  
}
