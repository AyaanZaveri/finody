import { useState, useEffect } from "react";
import { jellyfinAuth } from "../utils/jellyfinAuth";

export const useJellyfin = () => {
  const [api, setApi] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const handleJellyfin = async () => {
    if (window !== undefined) {
      const serverUrl = localStorage.getItem("serverUrl") as string;
      const userName = localStorage.getItem("userName") as string;
      const password = localStorage.getItem("password") as string;

      const jellyData = await jellyfinAuth(serverUrl, userName, password);

      setApi(jellyData?.api);
      setUser(jellyData?.auth?.data?.User);
      setData(jellyData);
    }
  };

  useEffect(() => {
    handleJellyfin();
  }, []);

  return { api, user, data };
};
