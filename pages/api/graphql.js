import  {  ApolloServer  }  from  "apollo-server-micro";
import  {  typeDefs  }  from  "./schemas";
import  {  resolvers  }  from  "./resolvers";

const  apolloServer  =  new  ApolloServer({  typeDefs,  resolvers  });


export  const  config  =  {
    api:  {
        bodyParser:  false
    }
};

export  default async function(){
    await server.start();
    apolloServer.createHandler({ path:  "/api/graphql"  });
} 