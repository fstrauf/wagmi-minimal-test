import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import Image from '@tiptap/extension-image'
import Router from "next/router"; 
// import { PostProps } from '../components/Post';

type Props = {
    content?: any;
    contentId?: String;
  };

const Tiptap: React.FC<Props> = (props) => {

    const content = props?.content ?? '{}'

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
            },
        },
        content: JSON.parse(content),
    })

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const submitData = async (e: React.SyntheticEvent) => {

        const contentId = props.contentId
    
        const title = 'testing'
        const content = JSON.stringify(editor.getJSON())
    
        e.preventDefault();
        try {
          const body = { title, content, contentId };
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

    return (
        <div>            
            <MenuBar editor={editor} />
            <button onClick={addImage} className='text-lg font-bold m-1 border-2 rounded-lg'>add image from URL</button>
            <EditorContent editor={editor} />
            <button className="m-2 bg-gray-200 border-solid border-2 border-sky-500 rounded" onClick={submitData}>Save</button>
        </div>
    )
}

export default Tiptap;

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    return (
        <>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                //   className={editor.isActive('bold') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
                //   className={editor.isActive('italic') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run()
                }
                //   className={editor.isActive('strike') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                strike
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleCode()
                        .run()
                }
                //   className={editor.isActive('code') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                code
            </button>
            <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className='text-lg font-bold m-1 border-2 rounded-lg'>
                clear marks
            </button>
            <button onClick={() => editor.chain().focus().clearNodes().run()} className='text-lg font-bold m-1 border-2 rounded-lg'>
                clear nodes
            </button>
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                //   className={editor.isActive('paragraph') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                paragraph
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                //   className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                h1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                //   className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                h2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                //   className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                h3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                //   className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                h4
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                //   className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                h5
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                //   className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                h6
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                //   className={editor.isActive('bulletList') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                bullet list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                //   className={editor.isActive('orderedList') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                ordered list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                //   className={editor.isActive('codeBlock') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                code block
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                //   className={editor.isActive('blockquote') ? 'is-active' : ''}
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                blockquote
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className='text-lg font-bold m-1 border-2 rounded-lg'>
                horizontal rule
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()} className='text-lg font-bold m-1 border-2 rounded-lg'>
                hard break
            </button>
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .undo()
                        .run()
                }
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                undo
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .redo()
                        .run()
                }
                className='text-lg font-bold m-1 border-2 rounded-lg'
            >
                redo
            </button>            
        </>
    )
}