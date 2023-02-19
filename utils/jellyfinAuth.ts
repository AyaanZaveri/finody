import { Jellyfin } from "@jellyfin/sdk";

export const jellyfinAuth = async (
  serverUrl: string,
  userName: string,
  password: string
) => {
  if (!serverUrl && !userName && !password) return;
  const jellyfin = new Jellyfin({
    clientInfo: {
      name: "Finody",
      version: "1.0.0",
    },
    deviceInfo: {
      name: "Device Name",
      id: "unique-device-id",
    },
  });
  const createdApi = jellyfin.createApi(serverUrl);
  const auth = await createdApi.authenticateUserByName(userName, password);

  return {
    auth: auth,
    api: createdApi,
  };
};
