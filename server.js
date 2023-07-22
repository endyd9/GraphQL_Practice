import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "Hello",
    userId: "2",
  },
  {
    id: "2",
    text: "bye",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    userName: "test",
    firstName: "user",
    lastName: "test",
  },
  {
    id: "2",
    userName: "test2",
    firstName: "user2",
    lastName: "test2",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    userName: String!
    firstName: String!
    lastName: String
    """
    firstName + lastName : String
    """
    fullName: String!
  }
  """
  트윗 오브젝트
  """
  type Tweet {
    id: ID!
    text: String!
    userId: User
  }

  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    트윗 삭제
    """
    deleteTweet(id: ID!): Boolean!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("all");
      return users;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const user = users.find((u) => u.id === userId);
      if (!user) return null;
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((t) => t.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((t) => t.id !== id);
      return true;
    },
  },
  User: {
    firstName({ firstName }) {
      return firstName;
    },
    fullName(root) {
      console.log(root);
      return `${root.lastName} ${root.firstName}`;
    },
  },
  Tweet: {
    userId({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(({ url }) => {
  console.log(`Running on ${url}`);
});
