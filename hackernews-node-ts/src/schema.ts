import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql"
import { Link, User, Vote } from "@prisma/client";
import { GraphQLContext } from "./context";
import { compare, hash } from "bcryptjs";
import { APP_SECRET } from "./auth";
import { sign } from "jsonwebtoken";
import { pubSubChannels } from "./pubsub";

const resolvers = {
    Query: {
        info: () => 'This is the API of a HackerNews Clone',
        feed: async (parent: unknown, args: {}, context: GraphQLContext) => {
            return context.prisma.link.findMany();
        },
        me: (parent: unknown, args: {}, context: GraphQLContext) => {
            if (context.currentUser === null) {
                throw new Error("Unauthenticated")
            }
            return context.currentUser;
        },
        links: (parent: User, args: {}, context: GraphQLContext) => {
            return context.prisma.user.findUnique({ where: { id: parent.id } }).links()
        },
        votes: (parent: Vote, args: {}, context: GraphQLContext) => {
            return context.prisma.vote.findUnique({ where: { id: parent.id } })
        }
    },

    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
        postedBy: async (parent: Link, args: {}, context: GraphQLContext) => {
            if (!parent.postedById) {
                return null;
            }

            return context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .postedBy();
        },
    },

    Vote: {
        id: (parent: Vote) => parent.id,
        link: (parent: Vote, args: {}, context: GraphQLContext) => {
            return context.prisma.vote.findUnique({ where: { id: parent.id } }).link()
        },
        user: (parent: Vote, args: {}, context: GraphQLContext) => {
            return context.prisma.vote.findUnique({ where: { id: parent.id } }).user()
        }
    },

    Mutation: {
        signup: async (parent: unknown,
            args: { email: string, password: string, name: string },
            context: GraphQLContext
        ) => {
            const password = await hash(args.password, 10)
            const user = await context.prisma.user.create({
                data: { ...args, password }
            })

            const token = sign({ userId: user.id }, APP_SECRET);

            return {
                token,
                user,
            }
        },

        login: async (parent: unknown, args: { email: string, password: string }, context: GraphQLContext) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email },
            })

            if (!user) {
                throw new Error("No such user found")
            }

            const valid = await compare(args.password, user.password);
            if (!valid) {
                throw new Error("Invalid Password")
            }

            const token = sign({ userId: user.id }, APP_SECRET)

            return {
                token,
                user,
            }
        },

        post: async (parent: unknown, args: { description: string, url: string }, context: GraphQLContext) => {
            if (context.currentUser === null) {
                throw new Error("Unauthenticated");
            }

            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                    postedBy: { connect: { id: context.currentUser.id } }
                },
            });

            context.pubSub.publish("newLink", { createdLink: newLink });
            return newLink
        },
        vote: async (parent: unknown, args: { linkId: string }, context: GraphQLContext) => {
            if (!context.currentUser) {
                throw new Error("You must login in order to use upvote!")
            }

            const userId = context.currentUser.id

            const vote = await context.prisma.vote.findUnique({
                where: {
                    linkId_userId: {
                        linkId: Number(args.linkId),
                        userId: userId
                    }
                }
            })

            if (vote !== null) {
                throw new Error(`Already voted for link: ${args.linkId}`)
            }

            const newVote = await context.prisma.vote.create({
                data: {
                    user: { connect: { id: userId } },
                    link: { connect: { id: Number(args.linkId) } }
                },
                include: {
                    link: true,
                    user: true
                }
            })

            context.pubSub.publish("newVote", { createdVote: newVote })
            return newVote
        }
    },
    Subscription: {
        newLink: {
            subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
                return context.pubSub.asyncIterator("newLink"); // <--- use rawPubSub here
            },
            resolve: (payload: pubSubChannels["newLink"][0]) => {
                return payload.createdLink;
            }
        },
        newVote: {
            subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
                return context.pubSub.asyncIterator("newVote"); // <--- use rawPubSub here
            },
            resolve: (payload: pubSubChannels["newVote"][0]) => {
                return payload.createdVote;
            }
        }
    }

}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
