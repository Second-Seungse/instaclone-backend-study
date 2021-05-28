import { gql } from "apollo-server";

// TODO Like 타입이 꼭 필요한지 다시 검증해보자
export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    likes: Int!
    hashtags: [Hashtag]
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
