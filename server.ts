import { Application, HttpError, Status } from "https://deno.land/x/oak/mod.ts";
import { applyGraphQL, gql} from "https://deno.land/x/oak_graphql/mod.ts";
import { GraphQLScalarType, Kind } from "https://deno.land/x/oak_graphql/deps.ts";

/*
import { watch } from "https://deno.land/x/watch@1.1.0/mod.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  } from "https://deno.land/std/ws/mod.ts";

const port = Deno.args[0] || "8088";
*/

const app = new Application();

// Error Handling
app.use(async (context, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      context.response.status = e.status as any;
      if (e.expose) {
        context.response.body = `<!doctype html><html><body><h1>${e.status} - ${e.message}</h1></body></html>`;
      } else {
        context.response.body = `<!doctype html><html><body><h1>${e.status} - ${Status[e.status]}</h1></body></html>`;
      }
    } else if (e instanceof Error) {
      context.response.status = 500;
      context.response.body = `<!doctype html><html><body><h1>500 - Internal Server Error</h1></body></html>`;
      console.log("Unhandled Error:", e.message);
      console.log(e.stack);
    }
  }
});

const blogs = [
  {author: 'Foo Bar', created: new Date('01/10/2010'), title: 'Foo Title', description: 'Descriptive Foo', url: 'http://127.0.0.1:8000'},
  {author: 'Bar Foo', created: new Date('01/12/2010'), title: 'Bar Title', description: 'Descriptive Bar', url: 'http://127.0.0.1:8000'},
  {author: 'Foobar Barfoo', created: new Date('01/11/2010'), title: 'Foobar Title', description: 'Descriptive Foobar', url: 'http://127.0.0.1:8000'},
]

const types = (gql as any)`
type Blog {
  author: String
  created: Date
  title: String
  description: String
  url: String
}

scalar Date

type Query {
  getAllBlogs(term: String): [Blog!]!
}
`;

const resolvers = {
  Query: {
    getAllBlogs: (term:String) => {
      return blogs;
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(val) {
      return new Date(val);
    },
    serialize(val:Date) {
      return val;
    },
    parseLiteral(ast:any) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value);
      }
      return null;
    }
  })
}

const GraphQLService = await applyGraphQL({
  typeDefs: types,
  resolvers: resolvers,
//  usePlayground: false,
  context: (ctx) => {
    return { user: 'Barfoo'};
  }
})

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

//Static serving
app.use(async (ctx) => {
  await ctx.send({
    root: `${Deno.cwd()}`,
    index: 'index.html',
  });
});

app.addEventListener('listen', ({hostname, port}) => {
  console.log(`Serving ${Deno.cwd()}`);
  console.log(`Start listening on ${hostname}:${port}`);
})

await app.listen({hostname: "0.0.0.0", port: 8080 });
/*
for await (const req of serve(`:${port}`)) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;

  try {
    const sock = await acceptWebSocket({
            conn,
	    bufReader
	    bufWriter,
	    headers,
	    });
    console.log("socket connected!");

    try {
      for await (const ev of sock) {
        if (typeof ev === "string") {
          console.log("ws:Text", ev);
            await sock.send(ev);
        } else if (isWebSocketPingEvent(ev)) {
          const [,body] = ev;
          console.log("ws:Ping", body);
        } else if (isWebSocketCloseEvent(ev)) {
          const { code, reason } = ev;
          console.log("ws:Close", code, reason);
        }
      }
    } catch (err) {
      console.error(`failed to accept websocket: ${err}`);
      await req.respond({ status: 400 });
    }
 }
 */
