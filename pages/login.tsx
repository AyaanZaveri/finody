import React, { useState } from "react";
import { jellyfinAuth } from "../utils/jellyfinAuth";
import { useRouter } from "next/router";

const Login = () => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleJellyfin = async () => {
    if (serverUrl.length < 0 && userName.length < 0)
      return;
    const jellyData = await jellyfinAuth(serverUrl, userName, password);
    // console.log("jellyData", jellyData);
    if (jellyData?.auth?.data?.User) {
      console.log("Login success");
      localStorage.setItem("serverUrl", serverUrl);
      localStorage.setItem("userName", userName);
      localStorage.setItem("password", password);

      router.push("/");
      window.location.reload();
    } else {
      console.log("Login failed");
    }
  };

  // console.log(serverUrl);

  return (
    <div className="ml-3 pl-[17rem] pr-12">
      <div className="pt-[4.5rem] pb-8">
        <div className="pt-6">
          <h1 className="text-3xl font-semibold text-stone-700 dark:text-white pb-6">
            Jellyfin Login
          </h1>
          <form className="flex flex-col gap-y-3 text-base">
            <label
              className="text-stone-700 dark:text-white"
              htmlFor="serverUrl"
            >
              Server URL
            </label>
            <input
              type="text"
              name="serverUrl"
              id="serverUrl"
              value={serverUrl}
              className="w-2/3 text-stone-500 text-base rounded-md border-none outline-none shadow-sm ring-1 ring-gray-300 focus:bg-gray-100 focus:ring-gray-500 dark:text-white dark:ring-gray-700 dark:bg-gray-800 dark:focus:ring-gray-500 dark:focus:bg-gray-700 transiton duration-200"
              onChange={(e) => setServerUrl(e.target.value)}
            />
            <label
              className="text-stone-700 dark:text-white"
              htmlFor="userName"
            >
              Username
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={userName}
              className="w-2/3 text-stone-500 text-base rounded-md border-none outline-none shadow-sm ring-1 ring-gray-300 focus:bg-gray-100 focus:ring-gray-500 dark:text-white dark:ring-gray-700 dark:bg-gray-800 dark:focus:ring-gray-500 dark:focus:bg-gray-700 transiton duration-200"
              onChange={(e) => setUserName(e.target.value)}
            />
            <label
              className="text-stone-700 dark:text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              className="w-2/3 text-stone-500 text-base rounded-md border-none outline-none shadow-sm ring-1 ring-gray-300 focus:bg-gray-100 focus:ring-gray-500 dark:text-white dark:ring-gray-700 dark:bg-gray-800 dark:focus:ring-gray-500 dark:focus:bg-gray-700 transiton duration-200"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => handleJellyfin()}
              className="bg-emerald-500 text-white rounded-md py-2 w-2/3 hover:bg-emerald-600 active:bg-emerald-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
