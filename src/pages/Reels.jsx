import { useState, useEffect, useRef, useContext } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { reelService } from '../services/index';
import { formatNumber } from '../utils/formatters';

const Reels = () => {
  const { user } = useContext(AuthContext);
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    // Auto-play current video
    if (videoRef.current && isPlaying) {
      videoRef.current.play();
    }
  }, [currentIndex, isPlaying]);

  const fetchReels = async () => {
    try {
      setLoading(true);
      // Fetch reels from API
      const response = await reelService.getUserReels(null, null, { size: 50 });
      setReels(response.content || getMockReels());
    } catch (error) {
      setReels(getMockReels());
    } finally {
      setLoading(false);
    }
  };

  const getMockReels = () => [
    {
      id: 1,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      caption: 'Help us build schools in rural areas! 🏫 #education #social',
      userId: 1,
      username: 'educationhero',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=educationhero',
      likesCount: 2340,
      commentsCount: 156,
      sharesCount: 89,
      campaignId: 1,
      campaignTitle: 'Education for All',
    },
    {
      id: 2,
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      caption: 'Clean water project update! 💧 Thanks to all supporters #water #environment',
      userId: 2,
      username: 'waterwarrior',
      profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=waterwarrior',
      likesCount: 1890,
      commentsCount: 92,
      sharesCount: 45,
      campaignId: 2,
      campaignTitle: 'Clean Water Initiative',
    },
  ];

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);
    
    if (newIndex !== currentIndex && newIndex < reels.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleLike = async (reelId) => {
    if (!user) return;

    const reel = reels.find(r => r.id === reelId);
    const wasLiked = reel.isLiked;

    setReels(reels.map(r =>
      r.id === reelId
        ? { ...r, likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1, isLiked: !r.isLiked }
        : r
    ));

    try {
      if (wasLiked) {
        await reelService.unlikeReel(reelId, user.id);
      } else {
        await reelService.likeReel(reelId, user.id);
      }
    } catch (error) {
      console.error('Failed to like/unlike reel:', error);
      setReels(reels.map(r =>
        r.id === reelId
          ? { ...r, isLiked: wasLiked, likesCount: wasLiked ? r.likesCount + 1 : r.likesCount - 1 }
          : r
      ));
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="Loading reels..." />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-4">No reels available</p>
          <p className="text-text-tertiary">Check back later for campaign updates!</p>
        </div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <div className="h-screen bg-dark-bg overflow-hidden">
      <div
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="h-screen snap-start relative flex items-center justify-center bg-black"
          >
            {/* Video */}
            <video
              ref={index === currentIndex ? videoRef : null}
              src={reel.videoUrl}
              className="h-full w-full object-contain"
              loop
              autoPlay={index === currentIndex}
              muted={isMuted}
              playsInline
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <img
                  src={reel.profilePictureUrl}
                  alt={reel.username}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div>
                  <p className="text-white font-semibold">@{reel.username}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-accent-purple hover:bg-accent-purple-hover text-white rounded-full font-semibold transition-colors">
                Follow
              </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="max-w-lg">
                <p className="text-white mb-2 leading-relaxed">
                  {reel.caption}
                </p>
                {reel.campaignTitle && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm transition-colors">
                    <span>🎯</span>
                    <span>{reel.campaignTitle}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-10">
              {/* Like */}
              <button
                onClick={() => handleLike(reel.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  reel.isLiked ? 'bg-status-error' : 'bg-white/20 hover:bg-white/30'
                }`}>
                  <Heart
                    size={24}
                    className={reel.isLiked ? 'fill-white text-white' : 'text-white'}
                  />
                </div>
                <span className="text-white text-xs font-semibold">
                  {formatNumber(reel.likesCount)}
                </span>
              </button>

              {/* Comment */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <span className="text-white text-xs font-semibold">
                  {formatNumber(reel.commentsCount)}
                </span>
              </button>

              {/* Share */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <Share2 size={24} className="text-white" />
                </div>
                <span className="text-white text-xs font-semibold">
                  {formatNumber(reel.sharesCount)}
                </span>
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  {isMuted ? (
                    <VolumeX size={24} className="text-white" />
                  ) : (
                    <Volume2 size={24} className="text-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/30 z-10"
              >
                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <Play size={40} className="text-white ml-2" />
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col gap-2">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-accent-purple h-8'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Reels;