import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as https from "https";

export async function axiosReq(
  options: AxiosRequestConfig
): Promise<AxiosResponse<unknown, any>> {
  try {
    const data = await axios({
      url: options.url,
      method: options.method,
      data: options.data,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch videos...");
  }
}
