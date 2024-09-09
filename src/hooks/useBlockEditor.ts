import { useEffect, useState } from 'react';
import { useEditor, useEditorState } from '@tiptap/react';
import deepEqual from 'fast-deep-equal';
import type { AnyExtension } from '@tiptap/core';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider';
import type { Doc as YDoc } from 'yjs';
import { ExtensionKit } from '@/extensions/extension-kit';
import { userColors, userNames } from '@/lib/constants';
import { randomElement } from '@/lib/utils';
import type { EditorUser } from '@/components/BlockEditor/types';
import { initialContent } from '@/lib/data/initialContent';

interface UseBlockEditorProps {
  collabConfig?: {
    ydoc: YDoc;
    provider?: TiptapCollabProvider | null;
    userId?: string;
    userName?: string;
  };
}

export const useBlockEditor = ({ collabConfig }: UseBlockEditorProps) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    collabConfig?.provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected,
  );
  const { ydoc, provider } = collabConfig || {};

  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: ctx => {
        if (provider && !provider.isSynced) {
          provider.on('synced', () => {
            setTimeout(() => {
              if (ctx.editor.isEmpty) {
                ctx.editor.commands.setContent(initialContent);
              }
            }, 0);
          });
        } else if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent);
          ctx.editor.commands.focus('start', { scrollIntoView: true });
        }
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        provider
          ? Collaboration.configure({
              document: ydoc,
            })
          : undefined,
        provider
          ? CollaborationCursor.configure({
              provider,
              user: {
                name: randomElement(userNames),
                color: randomElement(userColors),
              },
            })
          : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc, provider],
  );
  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return [];
      }

      return ctx.editor.storage.collaborationCursor.users.map((user: EditorUser) => {
        const names = user.name?.split(' ');
        const firstName = names?.[0];
        const lastName = names?.[names.length - 1];
        const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`;

        return { ...user, initials: initials.length ? initials : '?' };
      });
    },
    equalityFn: deepEqual,
  });

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);

  return { editor, users, collabState };
};
