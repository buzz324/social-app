"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { User } from "lucide-react";

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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadProfile();
      loadUserPosts();
    }
  }, [session, params.userId]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/users/${params.userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts?userId=${params.userId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {profile.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="mt-1 text-gray-600">{profile.email}</p>
              <div className="mt-4 flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {profile._count.posts}
                  </p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {profile._count.followers}
                  </p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {profile._count.following}
                  </p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Posts</h2>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={loadUserPosts} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
