import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const ReorderFavoriteActivities = gql`
  mutation ReorderFavoriteActivities($newOrder: [String!]!) {
    reorderFavoriteActivities(newOrder: $newOrder) {
      ...Activity
    }
  }
  ${ActivityFragment}
`;

export default ReorderFavoriteActivities;
