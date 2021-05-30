import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Query: {
    seeHashtag: (_, { hashtag }, { client }) =>
      client.hashtag.findUnique({
        where: {
          hashtag,
        },
      }),
  },
};

export default resolver;
