import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import { PostProps } from '../components/Post';
import prisma from '../lib/prisma';
import Tiptap from '../components/TipTap';
import Router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { content: [] } };
  }

  const content = await prisma.content.findMany({

  });

  return {
    props: { content },
  };
};

type Props = {
  content: PostProps[];
};

const Content: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const [content1, setContent1] = useState({});
  const [content2, setContent2] = useState({});

  const submitData = async (e: React.SyntheticEvent) => {

    const title = 'testing'
    const contentString1 = JSON.stringify(content1)
    const contentString2 = JSON.stringify(content2)

    e.preventDefault();
    try {
      const body = { title, contentString1, contentString2 };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  }

  if (!session) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold underline">Content</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <Tiptap setContent={setContent1} />
        <Tiptap setContent={setContent2} />
        <button className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" onClick={submitData}>Save</button>
      </div>
    </Layout>
  );
};

export default Content;
