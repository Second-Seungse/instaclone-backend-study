import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
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