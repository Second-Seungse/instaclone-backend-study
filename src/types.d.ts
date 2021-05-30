import { PrismaClient } from ".prisma/client";
import { User } from ".prisma/client";

type Context = {
  client: PrismaClient;
  loggedInUser?: User;
};

export type Resolver = (
  root: any,
  args: any,
  context: Context,
  info: any
) => any;
export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
