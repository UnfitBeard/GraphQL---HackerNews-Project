import { Client } from "redis-om";
import { createClient } from "redis";

const url = process.env.REDIS_URL

//Creating a connection with node Redis
export const connection = createClient({url})
await connection.connect()

//Create a client and bind it to Node Redis connection
const client = await new Client().use(connection)

export default client