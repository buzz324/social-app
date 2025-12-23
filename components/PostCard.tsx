"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  likes: { userId: string }[];
}

interface PostCardProps {
  post: Post;
  onDelete: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{
    id: string;
    content: string;
    author: { name: string };
  }>>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like) => like.userId === session?.user?.id)
  );

  const handleLike = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const loadComments = async () => {
    if (comments.length > 0) {
      setShowComments(!showComments);
      return;
    }

    setLoadingComments(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setShowComments(true);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Link href={`/profile/${post.user.id}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700">
              {post.user.name[0].toUpperCase()}
            </div>
          </Link>
          <div>
            <Link
              href={`/profile/${post.user.id}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {post.user.name}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        {session?.user?.id === post.user.id && (
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="mt-3 relative h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-gray-200 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isLiked
              ? "text-red-600 hover:bg-red-50"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          {likesCount}
        </button>
        <button
          onClick={loadComments}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <MessageCircle className="h-5 w-5" />
          {post._count.comments}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
          {loadingComments ? (
            <p className="text-center text-sm text-gray-500">
              Loading comments...
            </p>
          ) : (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold">
                    {comment.author.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-lg bg-gray-100 p-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.author.name}
                    </p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              {session && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                  >
                    Post
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
