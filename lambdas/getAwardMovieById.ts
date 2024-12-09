import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Movie, MovieAward, MovieCast } from "../shared/types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";

type ResponseBody = {
  data: {
    awardBody: MovieAward;
    cast?: MovieCast[];
  };
};

const ajv = new Ajv({ coerceTypes: true });
const isValidQueryParams = ajv.compile(
  schema.definitions["MovieQueryParams"] || {}
);
const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", JSON.stringify(event));
    const parameters = event?.pathParameters;
    const awardBody = parameters?.awardBody
      ? parseInt(parameters.awardBody)
      : undefined;

    if (!awardBody) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Missing award Name" }),
      };
    }

    const getCommandOutput = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.AWARDS_TABLE_NAME,
        Key: { awardBody: awardBody },
      })
    );
    if (!getCommandOutput.Item) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Invalid Award Name" }),
      };
    }
    const body: ResponseBody = {
      data: { awardBody: getCommandOutput.Item as MovieAward },
    };
    const queryParams = event.queryStringParameters;
    if (isValidQueryParams(queryParams)) {
      let queryCommandInput: QueryCommandInput = {
        TableName: process.env.CAST_TABLE_NAME,
      };
      queryCommandInput = {
        ...queryCommandInput,
        KeyConditionExpression: "awardBody = :m",
        ExpressionAttributeValues: {
          ":m": awardBody,
        },
      };
      const queryCommandOutput = await ddbDocClient.send(
        new QueryCommand(queryCommandInput)
      );
      body.data.cast = queryCommandOutput.Items as MovieCast[];
    }

    // Return Response
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
