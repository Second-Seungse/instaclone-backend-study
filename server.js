require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (ctx) => {
    if (ctx.req) {
      // * http
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    } else {
      // * websocket
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },

  subscriptions: {
    /** 
     * @param {Object} connectionParams An object containing parameters included in the request, such as an authentication token.
     * @param {webSocket} webSocket The connecting or disconnecting WebSocket.
     * @param {ConnectionContext} context Context object for the WebSocket connection. This is not the context object for the associated subscription operation.
     */
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  },
});

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀😆 Server is running on http://localhost:${PORT}/ ✅`);
});
