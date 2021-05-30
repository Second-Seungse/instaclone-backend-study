import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolver: Resolvers = {
  Query: {
    seeRoom: protectedResolver((_, { id }, { client, loggedInUser }) =>
      client.room.findFirst({
        where: {
          id,
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
