import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "./useAuth";
import AddFavoriteActivity from "@/graphql/mutations/activity/addFavoriteActivity";
import RemoveFavoriteActivity from "@/graphql/mutations/activity/removeFavoriteActivity";
import { useSnackbar } from "./useSnackbar";
import UnauthorizedMessage from "@/components/Messages/UnauthorizedAction";
import GetFavoriteActivities from "@/graphql/queries/activity/getFavoriteActivities";
import { GetFavoriteActivitiesQuery } from "@/graphql/generated/types";

export const useFavoriteActivity = () => {
  const { user } = useAuth();
  const snackbar = useSnackbar();

  // Récupération des favoris
  const { data, loading, error } = useQuery<GetFavoriteActivitiesQuery>(GetFavoriteActivities);
  const favoriteIds : string[] = data?.getFavoriteActivities.map((fav) => fav.id) ?? [];

  const [addFavoriteActivity] = useMutation(AddFavoriteActivity, {
    update(cache, { data }) {
    if (!data?.addFavoriteActivity) return;
    cache.writeQuery({
      query: GetFavoriteActivities,
      data: {
        getFavoriteActivities: data.addFavoriteActivity,
        },
      });
    }
  });
  const [removeFavoriteActivity] = useMutation(RemoveFavoriteActivity, {
    update(cache, { data }) {
    if (!data?.removeFavoriteActivity) return;
    cache.writeQuery({
      query: GetFavoriteActivities,
      data: {
        getFavoriteActivities: data.removeFavoriteActivity,
        },
      });
    }
  });

  const handleToggleFavorite = async (activityId: string, isFavorite: boolean) => {
    if (!user) {
      snackbar.error(UnauthorizedMessage);
      return;
    }
    try {
      if (isFavorite) {
        const userActivities = await removeFavoriteActivity({ variables: { activityId } });
        snackbar.success("L'activité a été retirée des favoris.");
      } else {
        const userActivities = await addFavoriteActivity({ variables: { activityId } });
        snackbar.success(`L'activité a été ajoutée aux favoris.`);
      }
    } catch (error) {
        snackbar.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  return { 
    favoriteIds,
    loading,
    error,
    handleToggleFavorite 
  };
};
