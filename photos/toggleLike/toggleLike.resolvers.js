import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    toggleLike: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found",
        };
      }
      const likeWhere = {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      };
      const like = await client.like.findUnique({
        where: likeWhere,
      });
      if (like) {
        // * 이미 좋아요를 표시한 사진인 경우 좋아요를 해제
        await client.like.delete({
          where: likeWhere,
        });
      } else {
        await client.like.create({
          // * 유저, 사진 id와 연결된 좋아요
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};