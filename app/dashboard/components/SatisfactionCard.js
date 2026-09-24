'use client';

import { satisfactionData } from '../data/dashboardData';

// Custom SVG star — supports full, half, empty
function Star({ fill = 'full', size = 15 }) {
  const id = `star-${fill}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      {fill === 'half' && (
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#C85A32" />
            <stop offset="50%" stopColor="#e0dbd4" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M10 1.5 L12.39 7.26 L18.66 7.64 L14 11.74 L15.56 18.02 L10 14.77 L4.44 18.02 L6 11.74 L1.34 7.64 L7.61 7.26 Z"
        fill={
          fill === 'full' ? '#C85A32' :
          fill === 'half' ? `url(#${id})` :
          '#e0dbd4'
        }
      />
    </svg>
  );
}

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} fill="full" />);
    } else if (rating >= i - 0.5) {
      stars.push(<Star key={i} fill="half" />);
    } else {
      stars.push(<Star key={i} fill="empty" />);
    }
  }
  return <div className="db-stars" aria-label={`${rating} out of 5 stars`}>{stars}</div>;
}

export default function SatisfactionCard() {
  const { rating, total, feedback } = satisfactionData;

  return (
    <div className="db-card">
      <div className="db-card-inner">
        <div className="db-card-label">Customer Satisfaction</div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="db-rating-num">{rating.toFixed(1)}</span>
          <span className="db-rating-max">/ 5.0</span>
        </div>

        <StarRating rating={rating} />

        <div className="db-review-count">{total} verified reviews</div>

        <div className="db-feedback-list">
          {feedback.map((f, i) => (
            <div key={i} className="db-feedback-item">
              <div className="db-feedback-author">{f.author}</div>
              <div className="db-feedback-text">{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
