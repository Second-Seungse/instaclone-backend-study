import {
  loadFilesSync,
  makeExecutableSchema,
  mergeResolvers,
  mergeTypeDefs,
} from "graphql-tools";

// loadfilessync는 각 파일들의 export default 들을 불러오므로 설정 필요
// loadFilesSync 를 통해 파일 경로 패턴 정의
// __dirname 은 현재 실행 중인 폴더 경로
// /**/*.typeDefs.js : 모든 폴더의 모든 이름의 typeDefs.js
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(
  `${__dirname}/**/*.{queries,mutations}.js`
);

const typeDefs = mergeTypeDefs(loadedTypes);
const resolvers = mergeResolvers(loadedResolvers);

//makeExecutableSchema 를 사용하여 typedef와 resolver를 하나의 스키마로 정의
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;