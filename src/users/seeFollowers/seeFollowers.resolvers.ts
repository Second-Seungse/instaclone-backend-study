import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
      const ok = await client.user.findUnique({
        where: { username },
        // * select가 없으면 user의 모든 정보를 가져온다. 하지만 select에 값을 지정하면 해당 값만을 가져온다.
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      // 팔로워들을 페이지로 노출
      // findUnique로 유저의 id를 기준으로한 유저를 찾고 그 유저의 followers리스트를 다시 pagination으로 검색
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};

export default resolver;
