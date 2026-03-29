import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

console.log("Redis connection is sucessfull.");


export default client