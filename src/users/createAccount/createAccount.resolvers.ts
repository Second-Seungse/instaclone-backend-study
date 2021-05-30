import bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        // * Check if username or email are already on DB.
        // findFirst : 조건에 맞는 첫 번째 결과를 return
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          return {
            ok: false,
            error: "This username/password is already taken😅",
          };
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        const result = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        if(result){
          return {
            ok: true,
            error: "Account Create Success!",
          };
        }
        
        // * hash password
        // * save and return the user
      } catch (e) {
        return {
          ok: false,
          error: `Account Create Fail => ${e}`,
        };
      }
    },
  },
};

export default resolver;
