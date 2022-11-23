import React, { useCallback, useMemo, useState } from 'react'

import Layout from '../components/Layout';
import Router from 'next/router';
import Editor from '../components/Editor';


// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic'
// import { Editor } from 'slate';

const Draft: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

  // const [value, setValue] = useState();
  const [formFields, setFormFields] = useState();
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const submitData = async (e: React.SyntheticEvent) => {

    // console.log(value)
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />

          <input disabled={!content || !title} type="submit" value="Create" />

          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
        <div className="text-editor">
          <ReactQuill theme="snow"
            // modules={modules}
            // formats={formats}
            onChange={value => handleChangeInput(value)}
            value={formFields}
          >
          </ReactQuill>
          <Editor/>
        </div>
      </div>
    </Layout>
  );

  function handleChangeInput(targetValue) {
    console.log(targetValue)
    // const values = [...formFields];
    // values[0][targetName] = targetValue
    setFormFields(targetValue);
  }

};

export default Draft;
