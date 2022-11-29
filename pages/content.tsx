// pages/content.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import { PostProps } from '../components/Post';
import prisma from '../lib/prisma';
import Router from "next/router"; 
// import React from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

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


  if (!session) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold underline">Content</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

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

  const placeholder = 'Compose an epic...';

  const { quill, quillRef } = useQuill({ modules, formats, placeholder });

  const submitData = async (e: React.SyntheticEvent) => {
    // there are a bunch of converters https://github.com/quilljs/awesome-quill

    // console.log(quill.getText())
    // console.log(quill.getContents())

    const title = 'testing'
    const content = JSON.stringify(quill.getContents())

    e.preventDefault();
    try {
      const body = { title, content };
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

  React.useEffect(() => {
    if (quill) {
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

  return (
    <Layout>
      <div className="page">
        <h1>Content</h1>
        <div className='w-3/4 h-90 m-auto'>
          <div ref={quillRef} />
          <button className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" onClick={submitData}>Save</button>
        </div>

      </div>
    </Layout>
  );
};

export default Content;
