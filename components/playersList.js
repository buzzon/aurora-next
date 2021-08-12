import { gql, useQuery } from "@apollo/client";

  export const ALL_PLAYERS_QUERY = gql`
    query allPlayers {
      queryPlayer {
        name
        position
        country {
          id
          name
          stadium
        }
        club {
          id
          name
          stadium
        }
        id
      }
    }
  `;

  const { loading, error, data } = useQuery(ALL_PLAYERS_QUERY);