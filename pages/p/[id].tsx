import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Tiptap from '../../components/TipTap';
import { generateHTML } from '@tiptap/html'
import React, { useMemo } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import parse from 'html-react-parser';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const content = JSON.parse(props.content)

  const output = useMemo(() => {
    return generateHTML(content, [
      StarterKit,
      Image,
      // other extensions …
    ])
  }, [content])

  const jsxReady = parse(output)

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <Tiptap content={props.content} contentId={props.id} />
        <button onClick={() => publishPost(props.id)}>Publish</button>
        <button onClick={() => deletePost(props.id)}>Delete</button>
      </div>
      <article class="prose md:prose-lg lg:prose-xl">
        {jsxReady}
      </article>

    </Layout>
  );
};

export default Post;