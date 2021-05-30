import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Query: {
    searchPhotos: (_, { keyword }, { client }) =>
      client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
      }),
  },
};

export default resolver;
