import React from "react";
import Router from "next/router";

export type PostProps = {
  cashReward: any;
  user: any;
  url: string;
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  description: string;
  pointsVote: Number;
  createdOn: any;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      {/* <ReactMarkdown children={post.content} /> */}
    </div>
  );
};

export default Post;
