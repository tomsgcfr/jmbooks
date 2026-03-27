'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExt from '@tiptap/extension-image'
import LinkExt from '@tiptap/extension-link'
import styles from './RichTextEditor.module.css'

type Props = {
    content?: string
    onChange: (html: string) => void
}

export default function RichTextEditor({ content = '', onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageExt,
            LinkExt.configure({ openOnClick: false }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) return null

    function addLink() {
        const url = prompt('Enter URL:')
        if (url) {
            editor!.chain().focus().setLink({ href: url }).run()
        }
    }

    function addImage() {
        const url = prompt('Enter image URL:')
        if (url) {
            editor!.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className={styles.editor}>
            <div className={styles.toolbar}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? styles.active : ''}
                >
                    Bold
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? styles.active : ''}
                >
                    Italic
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? styles.active : ''}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? styles.active : ''}
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? styles.active : ''}
                >
                    Bullet List
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? styles.active : ''}
                >
                    Numbered List
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? styles.active : ''}
                >
                    Quote
                </button>
                <button type="button" onClick={addLink}>
                    Link
                </button>
                <button type="button" onClick={addImage}>
                    Image
                </button>
            </div>
            <EditorContent editor={editor} className={styles.content} />
        </div>
    )
}
