import { gql } from "apollo-server";

export default gql`
  type Mutation {
    uploadPhoto(file: Upload!, caption: String): Photo
  }
`;

/* 
export default gql`
  type Mutation {
    uploadPhoto(file: Upload!, caption: String): MutationResponse!
  }
`;
 */
