import { useFavoriteActivity } from '@/hooks';
import { Button } from '@mantine/core';
import React from 'react';

interface FavoriteButtonProps {
  activityId: string;
  isFavorite: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ activityId, isFavorite }) => {
  const { handleToggleFavorite } = useFavoriteActivity();

  return (
    <Button
      type='button'
      onClick={() => handleToggleFavorite(activityId, isFavorite)}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: isFavorite ? '#FFD700' : '#888'
      }}
    >
      {isFavorite ? "★" : "☆"}
    </Button>
  );
};

export default FavoriteButton;