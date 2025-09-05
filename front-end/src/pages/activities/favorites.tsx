import { ActivityListItem, EmptyData } from '@/components';
import GetFavoriteActivities from '@/graphql/queries/activity/getFavoriteActivities';
import { useFavoriteActivity } from '@/hooks';
import { useQuery } from '@apollo/client';
import { Divider, Flex } from '@mantine/core';
import { Fragment } from 'react';

const FavoritesPage = () => {
  const { favoriteFragments, loading, error } = useFavoriteActivity();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div>
      <h1>Mes activités favorites</h1>
        <Flex direction="column" gap="lg">
            {favoriteFragments.length > 0 ? 
                (favoriteFragments.map((activity, idx) => (
                <Fragment key={activity.id}>
                <ActivityListItem
                    activity={activity}
                    isFavorite={true}
                />
                {idx < favoriteFragments.length - 1 && <Divider my="sm" />}
                </Fragment>
            ))
            ) : (
            <EmptyData />
            )}
        </Flex>
    </div>
  );
};

export default FavoritesPage;