import { REDIS_PASSWORD } from "$env/static/private";
import Redis from "ioredis";

const client = new Redis({
  host: "redis-16423.c253.us-central1-1.gce.cloud.redislabs.com",
  port: 16423,
  password: REDIS_PASSWORD,
  lazyConnect: true,
});

export default client;
