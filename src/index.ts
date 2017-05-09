import * as express from "express";
import * as GraphQLHTTP from "express-graphql";
import { buildSchema } from "graphql";

const app = express();

app.set("port", process.env.PORT || 4000);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String,
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int],
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return "Hello World!";
  },
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: (args: any) => {
    const output = [];
    for (let i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  },
};

app.use("/graphql", GraphQLHTTP({
  graphiql: true,
  schema,
  rootValue: root,
}));

app.listen(app.get("port"), () => {
    console.log("GraphQL tutorial server listening on port " + app.get("port"));
})
;
