import jwt from "jsonwebtoken";
import client from "../client";

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
