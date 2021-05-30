import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolver: Resolvers = {
  Query: {
    seeFeed: protectedResolver((_, __, { client, loggedInUser }) =>
      client.photo.findMany({
        // * 팔로워 목록에 내 아이디가 있는 유저들의 photo를 찾는다.
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              userId: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};

export default resolver;
