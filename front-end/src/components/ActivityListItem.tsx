import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import { Box, Button, Flex, Image, Text } from "@mantine/core";
import Link from "next/link";
import FavoriteButton from "./Button/FavoriteButton";
import { useAuth } from "@/hooks";

interface ActivityListItemProps {
  activity: ActivityFragment;
  isFavorite: boolean;
}

export function ActivityListItem({ activity, isFavorite }: ActivityListItemProps) {
  const { classes } = useGlobalStyles();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <Flex align="center" justify="space-between">
      <Flex gap="md" align="center">
        <Image
          src="https://dummyimage.com/125"
          radius="md"
          alt="random image of city"
          height="125"
          width="125"
        />
        <Box sx={{ maxWidth: "300px" }}>
          <Text className={classes.ellipsis}>{activity.city}</Text>
          <Text className={classes.ellipsis}>{activity.name}</Text>
          <Text className={classes.ellipsis}>{activity.description}</Text>
          <Text
            weight="bold"
            className={classes.ellipsis}
          >{`${activity.price}€/j`}</Text>
        </Box>
      </Flex>
      <FavoriteButton activityId={activity.id} isFavorite={isFavorite} />
              {isAdmin && activity.createdAt && (
          <Text size="xs" color="gray">
            Créée le : {new Date(activity.createdAt).toLocaleString()}
          </Text>
        )}
      <Link href={`/activities/${activity.id}`} className={classes.link}>
        <Button variant="outline" color="dark">
          Voir plus
        </Button>
      </Link>
    </Flex>
  );
}
