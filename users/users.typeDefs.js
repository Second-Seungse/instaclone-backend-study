import { gql } from "apollo-server";

// * totalFollowing, totalFollowers 등 DB에 없는 값을 조회하는경우 resolver를 찾아 참조한다.
export default gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    avatar: String
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;

//isFollowing: Boolean!