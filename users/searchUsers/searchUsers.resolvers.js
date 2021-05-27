import client from "../../client";

// TODO pagenation 을 이용해서 검색결과를 노출한다. skip, take, cursor
export default {
  Query: {
    searchUsers: async (_, { keyword, lastId }) =>
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
