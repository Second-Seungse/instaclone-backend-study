import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolver: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { client, loggedInUser }) => {
        const ok = await client.user.findUnique({ where: { username } });
        if (!ok) {
          return {
            ok: false,
            error: "That user does not exist.",
          };
        }
        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              connect: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolver;