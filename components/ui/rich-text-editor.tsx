"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { useState, useCallback, useEffect } from 'react';
import { 
  Bold, 
  Strikethrough, 
  Plus, 
  Type, 
  AlignLeft, 
  List, 
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Minus,
  FileText,
  Hash,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

// lowlightインスタンスを作成
const lowlight = createLowlight();

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "読んだ本の感想を書いてみませんか？",
  className,
  disabled = false
}: RichTextEditorProps) {
  const [characterCount, setCharacterCount] = useState(0);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onChange(html);
      setCharacterCount(text.length);
    },
    editable: !disabled,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      setCharacterCount(text.length);
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('画像のURLを入力してください:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowAddMenu(false);
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('リンクのURLを入力してください:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 hover:bg-gray-100 transition-colors",
        isActive && "bg-gray-200 text-gray-900"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("relative", className)}>
      {/* エディタ本体 */}
      <div className="bg-white rounded-lg border border-gray-200 min-h-[500px] relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* ツールバー（画面下部固定） */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          {/* 文字数カウンター */}
          <span className="text-sm text-gray-500">{characterCount} 文字</span>

          {/* ツールバーボタン群 */}
          <div className="flex items-center gap-1">
            {/* 追加メニュー */}
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowAddMenu(!showAddMenu)}
                isActive={showAddMenu}
              >
                <Plus className="h-4 w-4" />
              </ToolbarButton>
              
              {showAddMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
                  <button
                    onClick={addImage}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>画像</span>
                  </button>
                  <button
                    onClick={addLink}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>リンク</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleBlockquote().run();
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <Quote className="h-4 w-4" />
                    <span>引用</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleCodeBlock().run();
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <Code className="h-4 w-4" />
                    <span>コード</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().setHorizontalRule().run();
                      setShowAddMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <Minus className="h-4 w-4" />
                    <span>区切り線</span>
                  </button>
                </div>
              )}
            </div>

            {/* 太字 */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            {/* 取り消し線 */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            {/* 見出しメニュー */}
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                isActive={showHeadingMenu || editor.isActive('heading')}
              >
                <Type className="h-4 w-4" />
              </ToolbarButton>
              
              {showHeadingMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px]">
                  <button
                    onClick={() => {
                      editor.chain().focus().setParagraph().run();
                      setShowHeadingMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <span>指定なし</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleHeading({ level: 2 }).run();
                      setShowHeadingMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <Hash className="h-4 w-4" />
                    <span>大見出し</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleHeading({ level: 3 }).run();
                      setShowHeadingMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <Hash className="h-4 w-4" />
                    <span>小見出し</span>
                  </button>
                </div>
              )}
            </div>

            {/* 行揃えメニュー */}
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowAlignMenu(!showAlignMenu)}
                isActive={showAlignMenu}
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              
              {showAlignMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px]">
                  <button
                    onClick={() => {
                      editor.chain().focus().setTextAlign('left').run();
                      setShowAlignMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <span>左揃え</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().setTextAlign('center').run();
                      setShowAlignMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <span>中央揃え</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().setTextAlign('right').run();
                      setShowAlignMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <span>右揃え</span>
                  </button>
                </div>
              )}
            </div>

            {/* リストメニュー */}
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowListMenu(!showListMenu)}
                isActive={showListMenu || editor.isActive('bulletList') || editor.isActive('orderedList')}
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              
              {showListMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px]">
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleBulletList().run();
                      setShowListMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <span>箇条書き</span>
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleOrderedList().run();
                      setShowListMenu(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <span>番号付き</span>
                  </button>
                </div>
              )}
            </div>

            {/* リンク */}
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
            >
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>
    </div>
  );
} 