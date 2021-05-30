import { uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolver: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { client, loggedInUser }) => {
        let hashtagObj = [];
        if (caption) {
          hashtagObj = processHashtags(caption);
        }
        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
        return client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                // * connectOrCreate는 조회해서 대상이 없으면 생성한다.
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      }
    ),
  },
};

export default resolver;