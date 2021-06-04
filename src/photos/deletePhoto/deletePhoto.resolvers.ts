import { protectedResolver } from "../../users/users.utils";
import { deleteFromS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";

// TODO comment가 달린 photo의 경우 삭제가 안된다. photo를 삭제할 경우 comment까지 삭제 필요

const resolver: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { client, loggedInUser }) => {
        const photo = await client.photo.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
            file: true,
          },
        });
        if (!photo) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "Not authorized.",
          };
        } else {
          await deleteFromS3(photo.file);
          await client.photo.delete({
            where: {
              id,
            },
          });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};

export default resolver;
