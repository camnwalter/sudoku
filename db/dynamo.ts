import AWS from "aws-sdk";
import { config } from "dotenv";
import { CellData } from "../utils/types";
config();

AWS.config.update({
  region: process.env.DEFAULT_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "sudoku";

export const getGames = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const { Items } = await dynamo.scan(params).promise();

  return Items!.reduce((acc, curr) => {
    acc[curr.game] = curr.L;
    return acc;
  }, {});
};

export const addGame = async (id: string, game: CellData[]) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      game: id,
      L: game,
    },
  };
  return dynamo.put(params).promise();
};

export const getGame = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      game: id,
    },
  };

  const { Item } = await dynamo.get(params).promise();

  if (Item?.L !== undefined) {
    return Item.L;
  }

  throw new Error("List is not defined!");
};

export const deleteGame = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      game: id,
    },
  };
  return dynamo.delete(params).promise();
};
