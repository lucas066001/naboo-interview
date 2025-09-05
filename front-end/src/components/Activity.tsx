import { ActivityFragment } from "@/graphql/generated/types";
import { useGlobalStyles } from "@/utils";
import { Badge, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import Link from "next/link";
import FavoriteButton from "./Button/FavoriteButton";
import { useAuth } from "@/hooks";

interface ActivityProps {
  activity: ActivityFragment;
  isFavorite: boolean;
}

export function Activity({ activity, isFavorite }: ActivityProps) {
  const { classes } = useGlobalStyles();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <Grid.Col span={4}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://dummyimage.com/480x4:3"
            height={160}
            alt="random image of city"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500} className={classes.ellipsis}>
            {activity.name}
          </Text>
          <FavoriteButton activityId={activity.id} isFavorite={isFavorite} />
        </Group>

        <Group mt="md" mb="xs">
          <Badge color="pink" variant="light">
            {activity.city}
          </Badge>
          <Badge color="yellow" variant="light">
            {`${activity.price}€/j`}
          </Badge>
        </Group>

        {isAdmin && activity.createdAt && (
          <Text size="xs" color="gray">
            Créée le : {new Date(activity.createdAt).toLocaleString()}
          </Text>
        )}

        <Text size="sm" color="dimmed" className={classes.ellipsis}>
          {activity.description}
        </Text>

        <Link href={`/activities/${activity.id}`} className={classes.link}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Voir plus
          </Button>
        </Link>
      </Card>
    </Grid.Col>
  );
}
