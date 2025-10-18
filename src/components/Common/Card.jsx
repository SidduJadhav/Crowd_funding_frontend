import { Heart, Share2 } from 'lucide-react';
import { formatCurrency, formatNumber, getDaysLeft, getFundingPercentage, truncateText } from '../../utils/formatters';

const Card = ({ campaign, onViewClick }) => {
  const {
    id,
    title,
    image,
    category,
    description,
    currentAmount = 0,
    goalAmount = 0,
    donorCount = 0,
    endDate,
    creatorName = 'Unknown Creator',
  } = campaign;

  const fundingPercentage = getFundingPercentage(currentAmount, goalAmount);
  const daysLeft = getDaysLeft(endDate);

  return (
    <div className="bg-dark-bg-secondary border border-dark-bg-tertiary rounded-lg overflow-hidden hover:border-accent-purple transition-all duration-200 group cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-dark-bg-tertiary h-48">
        <img
          src={image || 'https://via.placeholder.com/400x300?text=Campaign'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200 flex items-center justify-center gap-4">
          <button className="bg-accent-purple hover:bg-accent-purple-hover p-3 rounded-full text-white transition-colors">
            <Heart size={20} />
          </button>
          <button className="bg-accent-purple hover:bg-accent-purple-hover p-3 rounded-full text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-accent-purple text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Days Left Badge */}
        {daysLeft > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-status-warning text-dark-bg text-xs font-semibold px-3 py-1 rounded-full">
              {daysLeft}d left
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-text-primary font-bold text-lg mb-1 line-clamp-2 hover:text-accent-purple transition-colors">
          {title}
        </h3>

        {/* Creator */}
        <p className="text-text-secondary text-sm mb-3">{creatorName}</p>

        {/* Description */}
        <p className="text-text-tertiary text-sm mb-4 line-clamp-2">
          {truncateText(description, 80)}
        </p>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="w-full bg-dark-bg-tertiary rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent-purple to-purple-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${fundingPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-text-primary font-bold">
              {formatCurrency(currentAmount)}
            </span>
            <span className="text-text-tertiary text-sm">
              {fundingPercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-text-secondary text-sm pt-3 border-t border-dark-bg-tertiary">
          <div>{formatNumber(donorCount)} backers</div>
          <button
            onClick={onViewClick}
            className="text-accent-purple hover:text-accent-purple-hover font-medium transition-colors"
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;