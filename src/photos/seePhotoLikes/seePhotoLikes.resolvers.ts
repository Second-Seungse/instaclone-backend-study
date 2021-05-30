import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { id }, { client }) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      // * like마다 like.user를 찾아서 user만 가진 새로운 array를 return한다.
      return likes.map((like) => like.user);
    },
  },
};

export default resolver;
