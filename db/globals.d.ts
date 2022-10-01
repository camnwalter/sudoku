import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";

interface Client {
  connection: null | RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  >;
}

declare global {
  var client: Client;
}
