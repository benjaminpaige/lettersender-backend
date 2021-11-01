import { graphQLSchemaExtension } from "@keystone-next/keystone/schema";
import { addToCart } from './addToCart'
import { checkout } from './checkout'

// hack for vscode syntax highlighting 
const graphql = String.raw

export const extendGraphqlSchema = graphQLSchemaExtension({
    typeDefs: graphql`
        type Mutation {
            addToCart(letterId: ID): CartItem,
            checkout(token: String!): Order
        }
    `,
    resolvers: {
        Mutation: {
            addToCart,
            checkout
        }
    }
})