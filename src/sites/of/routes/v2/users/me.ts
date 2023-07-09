import { UserContext } from "@/sites/of/context.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/common/errors/request-errors.js";
import { getClient } from "@/common/http/index.js";
import { GetMeResponseBody } from "./types.js";

const path = "/api2/v2/users/me";

const headers = {
  Host: "onlyfans.com",
  Accept: "application/json, text/plain, */*",
  Referer: "https://onlyfans.com/",
};

export const get = async (context: UserContext) => {
  const url = context.getUrl(path);

  try {
    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...headers,
      ...contextHeaders,
    };
    const client = getClient();
    const response = await client.get<GetMeResponseBody>(url, {
      headers: reqHeaders,
      cookieJar: context.cookieJar,
    });

    if (response.statusCode === 200) {
      return {
        id: response.body.id,
        name: response.body.name,
        username: response.body.username,
        email: response.body.email,
        wsAuthToken: response.body.wsAuthToken,
      };
    }
    console.log(response.request);
    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
};
