import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

import { deltaToMarkdown } from 'quill-delta-to-markdown'
// const markdown = deltaToMarkdown(deltaFromElseWhere)

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
  // const userHasValidSession = Boolean(session);
  // const postBelongsToUser = session?.user?.email === props.author?.email;

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  // const placeholder = 'Compose an epic...';

  const { quill, quillRef } = useQuill({ modules, formats });

  React.useEffect(() => {
    if (quill) {
      quill.setContents(JSON.parse(props.content))
      // quill.clipboard.dangerouslyPasteHTML('<h1>React Hook for Quill!</h1>');
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log('Text change!');
        console.log(quill.getText()); // Get text only
        console.log(quill.getContents()); // Get delta contents
        console.log(quill.root.innerHTML); // Get innerHTML using quill
        console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);


  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        <div className='w-3/4 h-90 m-auto'>
          <div ref={quillRef} />
          <button className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded">Save</button>
        </div>
        {/* {!props.published && userHasValidSession && postBelongsToUser && ( */}
        <button onClick={() => publishPost(props.id)}>Publish</button>
        {/* )} */}
        {/* {userHasValidSession && postBelongsToUser && ( */}
        <button onClick={() => deletePost(props.id)}>Delete</button>
        {/* )} */}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;




// // pages/p/[id].tsx

// import React from 'react';
// import { GetServerSideProps } from 'next';
// // import ReactMarkdown from 'react-markdown';
// import Router from 'next/router';
// // import Layout from '../../components/Layout';
// import Layout from '../../components/Layout';
// import { PostProps } from '../../components/Post';
// import { useSession } from 'next-auth/react';
// import prisma from '../../lib/prisma';

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const post = await prisma.post.findUnique({
//     where: {
//       id: String(params?.id),
//     },
//     include: {
//       author: {
//         select: { name: true, email: true },
//       },
//     },
//   });
//   return {
//     props: post,
//   };
// };

// async function publishPost(id: string): Promise<void> {
//   await fetch(`/api/publish/${id}`, {
//     method: 'PUT',
//   });
//   await Router.push('/');
// }

// async function deletePost(id: string): Promise<void> {
//   await fetch(`/api/post/${id}`, {
//     method: 'DELETE',
//   });
//   Router.push('/');
// }


// const Post: React.FC<PostProps> = (props) => {
//   const { data: session, status } = useSession();
//   if (status === 'loading') {
//     return <div>Authenticating ...</div>;
//   }
//   const userHasValidSession = Boolean(session);
//   const postBelongsToUser = session?.user?.email === props.author?.email;
//   let title = props.title;
//   if (!props.published) {
//     title = `${title} (Draft)`;
//   }

//   return (
//     <Layout>
//       <div>
//         <h2>{title}</h2>
//         <p>By {props?.author?.name || 'Unknown author'}</p>
//         {/* <ReactMarkdown children={props.content} /> */}
//         {!props.published && userHasValidSession && postBelongsToUser && (
//           <button onClick={() => publishPost(props.id)}>Publish</button>
//         )}
//         {
//           userHasValidSession && postBelongsToUser && (
//             <button onClick={() => deletePost(props.id)}>Delete</button>
//           )
//         }
//       </div>     
//     </Layout>
//   );
// };

// export default Post;
