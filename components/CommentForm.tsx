import { FormEvent, VFC } from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateComment } from '../hooks/useMutateComment'
import { Spinner } from './Spinner'

export const CommentForm: VFC<{ noteId: string }> = ({ noteId }) => {
  const { editedComment } = useStore()
  const update = useStore((state) => state.updateEditedComment)
  const { createCommentMutation, updateCommentMutation } = useMutateComment()

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data: { user }, error } = await supabase.auth.getUser()
    //getuserは非同期処理なので、userが取得できなかった時の処理が必要
    if (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
        return; // エラーがある場合は処理を中断
    }
    // ユーザーが存在しない場合のチェック
    if (!user) {
        console.error("ユーザーが存在しません。");
        return;
    }
　　//↑からここまで
    if (editedComment.id === '') {
      createCommentMutation.mutate({
        content: editedComment.content,
        user_id: user.id,
        note_id: noteId,
      })
    } else {
      updateCommentMutation.mutate({
        id: editedComment.id,
        content: editedComment.content,
      })
    }
  }
  if (updateCommentMutation.isLoading || createCommentMutation.isLoading) {
    return <Spinner />
  }
  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        placeholder="new comment"
        value={editedComment.content}
        onChange={(e) => update({ ...editedComment, content: e.target.value })}
      />
      <button
        type="submit"
        className="ml-2 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {editedComment.id ? 'Update' : 'Send'}
      </button>
    </form>
  )
}