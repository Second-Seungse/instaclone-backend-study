import { Resolvers } from "../../types";

// TODO pagenation 을 이용해서 검색결과를 노출한다. skip, take, cursor
const resolver: Resolvers = {
  Query: {
    searchUsers: async (_, { keyword, lastId }, { client }) =>
      client.user.findMany({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      }),
  },
};

export default resolver;
