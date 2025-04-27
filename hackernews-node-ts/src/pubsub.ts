import { Link, Vote } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { TypedPubSub } from "typed-graphql-subscriptions";

export type pubSubChannels = {
  newLink: [{ createdLink: Link }]
  newVote: [{ createdVote: Vote }]
}

// First, create a raw pubsub
export const rawPubSub = new PubSub();

// Then wrap it
export const pubSub = new TypedPubSub<pubSubChannels>(rawPubSub);