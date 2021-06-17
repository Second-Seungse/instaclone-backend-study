import { loadFilesSync, mergeResolvers, mergeTypeDefs } from "graphql-tools";

// loadfilessync는 각 파일들의 export default 들을 불러오므로 설정 필요
// loadFilesSync 를 통해 파일 경로 패턴 정의
// __dirname 은 현재 실행 중인 폴더 경로
// /**/*.typeDefs.ts : 모든 폴더의 모든 이름의 typeDefs.ts
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.*`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.*`);

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);
