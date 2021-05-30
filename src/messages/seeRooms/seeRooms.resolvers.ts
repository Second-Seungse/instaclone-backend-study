import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolver: Resolvers = {
  Query: {
    seeRooms: protectedResolver(async (_, __, { client, loggedInUser }) =>
      client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      })
    ),
  },
};

export default resolver;
