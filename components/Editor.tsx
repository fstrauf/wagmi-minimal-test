import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic'

export default function Editor() {
  // const [value, setValue] = useState('');
  const [formFields, setFormFields] = useState();

  // const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
  const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

  return (
    <ReactQuill
      // name="reactQuill"
      onChange={value => handleChangeInput(value)}
      value={formFields}


    />
  )

  function handleChangeInput(targetValue) {
    console.log(targetValue)
    // const values = [...formFields];
    // values[0][targetName] = targetValue
    setFormFields(targetValue);
  }

}

// function handleChangeInput(index, event) {
//   const values = [...formFields];
//   values[index][event.target.name] = event.target.value
//   setFormFields(values);
// }