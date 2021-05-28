import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        if (caption) {
          const hashtags = caption.match(/#[\w]+/g);
          console.log(hashtags);
        }
        client.photo.create({
          data: {
            file,
            caption,
            hashtags: {
              // * connectOrCreate는 조회해서 대상이 없으면 생성한다.
              connectOrCreate: [
                {
                  where: {
                    hashtag: "#food",
                  },
                  create: {
                    hashtag: "#food",
                  },
                },
              ],
            },
          },
        });
      }
    ),
  },
};
