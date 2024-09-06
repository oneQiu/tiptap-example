'use client'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useSearchParams } from 'next/navigation'
import { useLayoutEffect, useMemo, useState } from 'react'
import { Doc as YDoc } from 'yjs'
import { BlockEditor } from '@/components/BlockEditor'

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjU2MTE3NDEsIm5iZiI6MTcyNTYxMTc0MSwiZXhwIjoxNzI1Njk4MTQxLCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI1YTU3MTllMy01ZDYxLTQxZTctODk0YS03N2M4ODhjYjNiMTEifQ.sOxY4sU_GhgKDOuk9sMyclQIg1ZTvv6CvkN6KCx-XGM'

export default function Document() {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken] = useState<string | null | undefined>(token)
  const searchParams = useSearchParams()
  const hasCollab = parseInt(searchParams?.get('noCollab') as string) !== 1 && collabToken !== null

  const ydoc = useMemo(() => new YDoc(), [])

  // useLayoutEffect(() => {
  //   if (hasCollab && collabToken) {
  //     setProvider(
  //       new TiptapCollabProvider({
  //         name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${room}`,
  //         appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? '',
  //         token: collabToken,
  //         document: ydoc,
  //       }),
  //     )
  //   }
  // }, [setProvider, collabToken, ydoc, hasCollab])

  if ((hasCollab && !provider) || collabToken === undefined) return

  return <BlockEditor hasCollab={hasCollab} ydoc={ydoc} provider={provider} />
}
