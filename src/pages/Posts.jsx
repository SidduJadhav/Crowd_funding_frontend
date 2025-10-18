import { useState, useEffect, useContext } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';
import { AuthContext } from '../context/AuthContext';
import { postService, followService } from '../services/index';
import { formatNumber } from '../utils/formatters';

const Posts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const following = await followService.getFollowing(user.id);
      const followingIds = following.users?.map(u => u.id) || [];
      
      if (followingIds.length > 0) {
        const response = await postService.getFeedPosts(followingIds, user.id, { size: 50 });
        setPosts(response.content || getMockPosts());
      } else {
        setPosts(getMockPosts());
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const getMockPosts = () => [
    {
      id: '1',
      userId: 1,
      username: 'educationhero',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=educationhero',
      caption: 'Exciting update on our education campaign! We just reached 75% of our goal! 🎉📚 Thank you to all supporters. Your contributions are changing lives! #education #crowdfunding',
      mediaUrls: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop'],
      likesCount: 2340,
      commentsCount: 156,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'Mumbai, India',
    },
    {
      id: '2',
      userId: 2,
      username: 'waterwarrior',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=waterwarrior',
      caption: 'Clean water installation complete in Village #12! 💧✨ 200 families now have access to clean drinking water. Next village starts tomorrow! #cleanwater #impact',
      mediaUrls: [
        'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=600&h=600&fit=crop',
      ],
      likesCount: 1890,
      commentsCount: 92,
      isLiked: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: 'Rural Maharashtra',
    },
  ];

  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    const wasLiked = post.isLiked;

    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
        : p
    ));

    try {
      if (wasLiked) {
        await postService.unlikePost(postId, user.id);
      } else {
        await postService.likePost(postId, user.id);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, isLiked: wasLiked, likesCount: wasLiked ? p.likesCount + 1 : p.likesCount - 1 }
          : p
      ));
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="Loading posts..." />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <EmptyState
          title="No posts yet"
          message="Follow creators to see their posts here"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.profilePictureUrl}
                    alt={post.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-text-primary font-semibold">
                      {post.username}
                    </p>
                    {post.location && (
                      <p className="text-text-tertiary text-xs">{post.location}</p>
                    )}
                  </div>
                </div>
                <button className="text-text-secondary hover:text-text-primary">
                  •••
                </button>
              </div>

              {/* Post Images */}
              <div className="relative">
                {post.mediaUrls.length === 1 ? (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post"
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-0.5">
                    {post.mediaUrls.slice(0, 4).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Post ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <Heart
                        size={24}
                        className={
                          post.isLiked
                            ? 'fill-status-error text-status-error'
                            : 'text-text-primary'
                        }
                      />
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                      <MessageCircle size={24} className="text-text-primary" />
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                      <Share2 size={24} className="text-text-primary" />
                    </button>
                  </div>
                  <button className="hover:opacity-70 transition-opacity">
                    <Bookmark size={24} className="text-text-primary" />
                  </button>
                </div>

                {/* Likes Count */}
                <p className="text-text-primary font-semibold mb-2">
                  {formatNumber(post.likesCount)} likes
                </p>

                {/* Caption */}
                <p className="text-text-primary mb-2">
                  <span className="font-semibold">{post.username}</span>{' '}
                  <span className="text-text-secondary">{post.caption}</span>
                </p>

                {/* Comments Link */}
                {post.commentsCount > 0 && (
                  <button className="text-text-tertiary text-sm mb-2 hover:text-text-secondary">
                    View all {post.commentsCount} comments
                  </button>
                )}

                {/* Time */}
                <p className="text-text-tertiary text-xs">
                  {getTimeAgo(post.createdAt)}
                </p>
              </div>

              {/* Comment Input */}
              <div className="border-t border-dark-bg-tertiary p-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-grow bg-transparent text-text-primary placeholder-text-tertiary focus:outline-none"
                />
                <button className="text-accent-purple font-semibold hover:text-accent-purple-hover">
                  Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;