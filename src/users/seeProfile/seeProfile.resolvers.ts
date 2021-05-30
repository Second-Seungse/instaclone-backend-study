import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Query: {
    seeProfile: (_, { username }, { client, loggedInUser }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};

export default resolver;