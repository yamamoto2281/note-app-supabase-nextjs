import { VFC, useEffect, useState } from 'react'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateComment } from '../hooks/useMutateComment'
import { Spinner } from './Spinner'
import { Comment } from '../types/types'

export const CommentItem: VFC<Omit<Comment, 'created_at' | 'note_id'>> = ({
  id,
  content,
  user_id,
}) => {
  const [userId, setUserId] = useState<string | undefined>('')
  const update = useStore((state) => state.updateEditedComment)
  const { deleteCommentMutation } = useMutateComment()
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
  if (deleteCommentMutation.isLoading) {
    return <Spinner />
  }
  return (
    <li className="my-3">
      <span>{content}</span>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id: id,
                content: content,
              })
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              deleteCommentMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}