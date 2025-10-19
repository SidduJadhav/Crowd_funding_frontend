import { useState, useEffect, useContext } from 'react';
import { Send, Heart, Reply, Trash2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { createComment, deleteComment, getCampaignComments, getPostComments, getReelComments, getCommentReplies } from '../../services/commentService';
import { formatDistanceToNow } from '../../utils/formatters';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

const CommentSection = ({ contentType, contentId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    if (contentId) {
      fetchComments();
    }
  }, [contentId, contentType]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      let response;

      if (contentType === 'campaign') {
        response = await getCampaignComments(contentId);
      } else if (contentType === 'post') {
        response = await getPostComments(contentId);
      } else if (contentType === 'reel') {
        response = await getReelComments(contentId);
      }

      setComments(response.content || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setSubmitting(true);
      const commentData = {
        userId: user.id,
        content: newComment,
        ...(contentType === 'campaign' && { campaignId: contentId }),
        ...(contentType === 'post' && { postId: contentId }),
        ...(contentType === 'reel' && { reelId: contentId }),
      };

      await createComment(commentData);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentCommentId) => {
    if (!replyText.trim() || !user) return;

    try {
      setSubmitting(true);
      const commentData = {
        userId: user.id,
        content: replyText,
        parentCommentId,
        ...(contentType === 'campaign' && { campaignId: contentId }),
        ...(contentType === 'post' && { postId: contentId }),
        ...(contentType === 'reel' && { reelId: contentId }),
      };

      await createComment(commentData);
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user || !window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId, user.id);
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const toggleReplies = async (commentId) => {
    if (expandedReplies[commentId]) {
      setExpandedReplies({ ...expandedReplies, [commentId]: null });
    } else {
      try {
        const replies = await getCommentReplies(commentId);
        setExpandedReplies({ ...expandedReplies, [commentId]: replies.content || [] });
      } catch (error) {
        console.error('Failed to fetch replies:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user && (
        <div className="flex gap-3">
          <img
            src={user.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-grow">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                loading={submitting}
              >
                <Send size={16} className="mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <img
                  src={comment.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-text-primary font-semibold">{comment.username}</span>
                        <span className="text-text-tertiary text-sm ml-2">
                          {formatDistanceToNow(comment.createdAt)}
                        </span>
                      </div>
                      {user && user.id === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-text-tertiary hover:text-status-error transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-text-primary">{comment.content}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-2 ml-2">
                    <button className="flex items-center gap-1 text-text-tertiary hover:text-accent-purple text-sm transition-colors">
                      <Heart size={14} />
                      <span>{comment.likeCount || 0}</span>
                    </button>
                    {user && (
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center gap-1 text-text-tertiary hover:text-accent-purple text-sm transition-colors"
                      >
                        <Reply size={14} />
                        <span>Reply</span>
                      </button>
                    )}
                    {comment.replyCount > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="text-accent-purple text-sm hover:underline"
                      >
                        {expandedReplies[comment.id] ? 'Hide' : `View ${comment.replyCount}`} {comment.replyCount === 1 ? 'reply' : 'replies'}
                      </button>
                    )}
                  </div>

                  {replyingTo === comment.id && (
                    <div className="mt-3 ml-2 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-grow px-3 py-2 bg-dark-bg border border-dark-bg-tertiary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-purple text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitReply(comment.id);
                          }
                        }}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText.trim() || submitting}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {expandedReplies[comment.id] && expandedReplies[comment.id].length > 0 && (
                    <div className="mt-4 ml-8 space-y-3">
                      {expandedReplies[comment.id].map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <img
                            src={reply.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.username}`}
                            alt={reply.username}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <div className="flex-grow">
                            <div className="bg-dark-bg border border-dark-bg-tertiary rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <div>
                                  <span className="text-text-primary font-semibold text-sm">{reply.username}</span>
                                  <span className="text-text-tertiary text-xs ml-2">
                                    {formatDistanceToNow(reply.createdAt)}
                                  </span>
                                </div>
                                {user && user.id === reply.userId && (
                                  <button
                                    onClick={() => handleDeleteComment(reply.id)}
                                    className="text-text-tertiary hover:text-status-error transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              <p className="text-text-primary text-sm">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
