import { EditorContent } from '@tiptap/react';
import React, { FC, useRef } from 'react';
import { LinkMenu } from './menus';
import { useBlockEditor } from '@/hooks/useBlockEditor';
import '@/styles/index.css';
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/extensions/MultiColumn/menus';
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus';
import { TextMenu } from './menus/TextMenu';
import { ContentItemMenu } from './menus';
import { Doc as YDoc } from 'yjs';
import { TiptapCollabProvider } from '@hocuspocus/provider';

interface BlockEditorProps {
  // 多人协作配置
  collabConfig?: {
    ydoc: YDoc;
    provider?: TiptapCollabProvider | null;
    userId?: string;
    userName?: string;
  };
}

export const BlockEditor: FC<BlockEditorProps> = ({ collabConfig }) => {
  const menuContainerRef = useRef(null);

  const { editor, users } = useBlockEditor({ collabConfig });

  if (!editor || !users) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
