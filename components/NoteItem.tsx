import { VFC, useEffect, useState } from 'react'
import Link from 'next/link'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateNote } from '../hooks/useMutateNote'
import { Spinner } from './Spinner'
import { Note } from '../types/types'

export const NoteItem: VFC<
  Omit<Note, 'created_at' | 'note_id' | 'comments'>
> = ({ id, title, content, user_id }) => {
  const [userId, setUserId] = useState<string | undefined>('')
  const update = useStore((state) => state.updateEditedNote)
  const { deleteNoteMutation } = useMutateNote()
  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        // エラーの場合
        if (error) {
            console.error("ユーザー情報の取得に失敗しました:", error);
            return; // エラーがある場合は処理を中断
        }
        // ユーザーが存在しない場合のチェック
        if (!user) {
            console.error("ユーザーが存在しません。");
            return;
        }
        setUserId(user.id);
    };
    fetchUser();
  }, [])
  if (deleteNoteMutation.isLoading) {
    return <Spinner />
  }
  return (
    <li className="my-3">
      <Link href={`/note/${id}`} prefetch={false} className="cursor-pointer hover:text-pink-600">{title}
      </Link>

      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id: id,
                title: title,
                content: content,
              })
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              deleteNoteMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}