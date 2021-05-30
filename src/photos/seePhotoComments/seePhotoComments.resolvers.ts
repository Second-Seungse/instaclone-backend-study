import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Query: {
    seePhotoComments: (_, { id }, { client }) =>
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

export default resolver;
