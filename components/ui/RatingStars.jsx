'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RatingStars({ rating = 5, totalReviews, size = 'sm', interactive = false, onRatingChange }) {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="inline-flex items-center gap-1">
      {stars.map((star) => {
        const isFilled = star <= Math.floor(rating);
        const isHalf = star > Math.floor(rating) && star < rating;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={cn(
              'focus:outline-none transition-transform',
              interactive && 'hover:scale-110 cursor-pointer',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : isHalf
                  ? 'text-amber-400 fill-amber-400/50'
                  : 'text-slate-300 fill-slate-100'
              )}
            />
          </button>
        );
      })}
      {rating > 0 && !interactive && (
        <span className="ml-1 text-xs font-bold text-slate-700">{Number(rating).toFixed(1)}</span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-500 font-normal ml-0.5">({totalReviews})</span>
      )}
    </div>
  );
}
