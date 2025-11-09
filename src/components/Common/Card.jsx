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
    <div
      className="bg-light-bg-secondary border border-light-bg-tertiary rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer hover:border-accent-green hover:shadow-xl hover:shadow-accent-green/20 transform hover:-translate-y-1" // UPDATED
      onClick={onViewClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-light-bg-tertiary h-48"> {/* UPDATED */}
        <img
          src={image || 'https://via.placeholder.com/400x300?text=Campaign'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert('Like clicked!');
            }}
            className="bg-accent-green hover:bg-accent-green-hover p-3 rounded-full text-white transition-all transform scale-0 group-hover:scale-100" // UPDATED
            style={{ transitionDelay: '100ms' }}
          >
            <Heart size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert('Share clicked!');
            }}
            className="bg-accent-green hover:bg-accent-green-hover p-3 rounded-full text-white transition-all transform scale-0 group-hover:scale-100" // UPDATED
            style={{ transitionDelay: '200ms' }}
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-accent-green text-white text-xs font-semibold px-3 py-1 rounded-full"> {/* UPDATED */}
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
        <h3 className="text-text-primary font-bold text-lg mb-1 line-clamp-2 group-hover:text-accent-green transition-colors"> {/* UPDATED */}
          {title}
        </h3>

        {/* Creator */}
        <p className="text-text-secondary text-sm mb-3">{creatorName}</p> {/* UPDATED */}

        {/* Description */}
        <p className="text-text-tertiary text-sm mb-4 line-clamp-2"> {/* UPDATED */}
          {truncateText(description, 80)}
        </p>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="w-full bg-light-bg-tertiary rounded-full h-2 overflow-hidden"> {/* UPDATED */}
            <div
              className="bg-gradient-to-r from-accent-green to-accent-light-green h-full rounded-full transition-all duration-300" // UPDATED
              style={{ width: `${fundingPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-text-primary font-bold"> {/* UPDATED */}
              {formatCurrency(currentAmount)}
            </span>
            <span className="text-text-tertiary text-sm"> {/* UPDATED */}
              {fundingPercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-text-secondary text-sm pt-3 border-t border-light-bg-tertiary"> {/* UPDATED */}
          <div>{formatNumber(donorCount)} backers</div>
          <div
            className="text-accent-green group-hover:text-accent-green-hover font-medium transition-colors" // UPDATED
          >
            View →
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;