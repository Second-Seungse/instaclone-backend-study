import jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (token) => {
  try {
    if (!token) return null;
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) return user;
    else return null;
  } catch {
    return null;
  }
};

// * 유저의 정보가 없을 경우 에러 요청
export const protectResolver = (user) => {
  if (!user) {
    return {
      ok: false,
      error: "You need to login.",
    };
  }
};

export const protectedResolver =
  (ourResolver: Resolver) => (root, args, context, info) => {
    // * 로그인이 되지 않은 상태인 경우
    if (!context.loggedInUser) {
      // * 로그인이 필요한 query는 전부 ok와 error를 정의해야하는 번거로움을 해결
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
