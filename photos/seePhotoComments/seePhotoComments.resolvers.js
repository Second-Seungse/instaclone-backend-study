import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_, { id }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        // TODO Pagination skip, take, cursor
        orderBy: {
          createdAt: "asc",
        },
      }),
  },
};
