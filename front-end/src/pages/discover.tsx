import { Activity, EmptyData, PageTitle } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import {
  GetActivitiesQuery,
  GetActivitiesQueryVariables,
  GetFavoriteActivitiesQuery,
} from "@/graphql/generated/types";
import GetActivities from "@/graphql/queries/activity/getActivities";
import GetFavoriteActivities from "@/graphql/queries/activity/getFavoriteActivities";
import { useAuth, useFavoriteActivity } from "@/hooks";
import { useQuery } from "@apollo/client";
import { Button, Grid, Group } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

interface DiscoverProps {
  activities: GetActivitiesQuery["getActivities"];
}

export const getServerSideProps: GetServerSideProps<
  DiscoverProps
> = async () => {
  const response = await graphqlClient.query<
    GetActivitiesQuery,
    GetActivitiesQueryVariables
  >({
    query: GetActivities,
  });
  return { props: { activities: response.data.getActivities } };
};

export default function Discover({ activities }: DiscoverProps) {
  const { user } = useAuth();
  const { favoriteIds } = useFavoriteActivity();

  return (
    <>
      <Head>
        <title>Discover | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Découvrez des activités" />
        {user && (
          <Link href="/activities/create">
            <Button>Ajouter une activité</Button>
          </Link>
        )}
      </Group>
      <Grid>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Activity activity={activity} key={activity.id} isFavorite={favoriteIds.includes(activity.id)} />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
    </>
  );
}
