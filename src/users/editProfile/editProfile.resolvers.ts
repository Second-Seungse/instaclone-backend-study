// import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { uploadToS3, deleteFromS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";

import { AWSS3Uploader } from '../../shared/aws.s3.utils';

const s3Uploader = new AWSS3Uploader({ 
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  destinationBucketName: process.env.AWS_BUCKET,
  region:  process.env.AWS_REGION,
});

const resolver: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { client, loggedInUser }
      ) => {
        const user = await client.user.findUnique({
          where: {
            id: loggedInUser.id,
          },
          select: {
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            bio: true,
            avatar: true,
          },
        });

        console.log(user);

        // * 로그인한 유저의 정보가 있는지 확인
        if (user) {
          // * avatart 변경
          let avatarUrl = undefined;
          if (avatar) {
            // avatarUrl = await s3Uploader.singleFileUploadResolver(_, avatar);
            avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
            await deleteFromS3(user.avatar);
            /**
             * * 서버내부에 파일을 저장하는 Stream
            const { filename, createReadStream } = await avatar;
            const newfilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + "/uploads/" + newfilename
            );
            readStream.pipe(writeStream);
            avatarUrl = `http://localhost:4000/static/${newFilename}`;
           */
          }

          // * password 변경
          let uglyPassword = null;
          if (newPassword) {
            uglyPassword = await bcrypt.hash(newPassword, 10);
          }

          const updatedUser = await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              firstName,
              lastName,
              username,
              email,
              bio,
              // * uglyPassword가 true이면 object를 반환한다.
              ...(uglyPassword && { password: uglyPassword }),
              ...(avatarUrl && { avatar: avatarUrl }),
            },
          });
          if (updatedUser.id) {
            return {
              ok: true,
            };
          } else {
            return {
              ok: false,
              error: "Could not update profile.",
            };
          }
        } else {
          return {
            ok: false,
            error: "User not found.",
          };
        }
      }
    ),
  },
};

export default resolver;
