import { ActivityListItem, EmptyData } from '@/components';
import GetFavoriteActivities from '@/graphql/queries/activity/getFavoriteActivities';
import { useFavoriteActivity } from '@/hooks';
import { useQuery } from '@apollo/client';
import { Divider, Flex } from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';

const FavoritesPage = () => {
  const { favoriteFragments, loading, error, handleReorderFavorites } = useFavoriteActivity();
    const [order, setOrder] = useState<string[]>([]);

    useEffect(() => {
    const newOrder = favoriteFragments.map((a) => a.id);
    if (JSON.stringify(newOrder) !== JSON.stringify(order)) {
        setOrder(newOrder);
    }
    }, [favoriteFragments, order]);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newOrder = [...order];
    console.log('initial order:', newOrder);
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    console.log('after swap order:', newOrder);
    setOrder(newOrder);
    handleReorderFavorites(newOrder);
  };

  const moveDown = (idx: number) => {
    if (idx === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    setOrder(newOrder);
    handleReorderFavorites(newOrder);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div>
      <h1>Mes activités favorites</h1>
        <Flex direction="column" gap="lg">
            {favoriteFragments.length > 0 ? 
                (favoriteFragments.map((activity, idx) => (
                <Flex align="center" direction="row" gap="md" key={activity.id}>
                    <Flex direction="column" gap="xs">
                    <button disabled={idx === 0} onClick={() => moveUp(idx)}>↑</button>
                    <button disabled={idx === order.length - 1} onClick={() => moveDown(idx)}>↓</button>
                    </Flex>
                    <ActivityListItem
                        activity={activity}
                        isFavorite={true}
                    />
                    {idx < favoriteFragments.length - 1 && <Divider my="sm" />}
                </Flex>
            ))
            ) : (
            <EmptyData />
            )}
        </Flex>
    </div>
  );
};

export default FavoritesPage;