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
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    userId: User
  }

  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    allUsers: [User!]!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
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
