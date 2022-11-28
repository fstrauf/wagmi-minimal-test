import React from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

//https://github.com/gtgalone/react-quilljs

export default function Editor() {

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

  const { quill, quillRef } = useQuill({modules, formats, placeholder });

  const submitData = async (e: React.SyntheticEvent) => {

    console.log(quill.getText())
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
    <div className='w-3/4 h-90 m-auto'>
      <div ref={quillRef} />
      <button onClick={submitData}>Test</button>
    </div>
  )
}