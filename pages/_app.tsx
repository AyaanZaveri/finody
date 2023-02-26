import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import { RecoilRoot, useRecoilState } from "recoil";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Jellyfin } from "@jellyfin/sdk";
import { apiState } from "../atoms/apiAtom";
import { userState } from "../atoms/userAtom";
import { jellyfinAuth } from "../utils/jellyfinAuth";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // get local storage values serverUrl, userName, password
  if (typeof window !== "undefined") {
    const serverUrl = localStorage.getItem("serverUrl");
    const userName = localStorage.getItem("userName");
    const password = localStorage.getItem("password");

    // if all values are present and the page is the login page, redirect to home page
    if (
      serverUrl &&
      userName &&
      password &&
      router.pathname === "/login" &&
      typeof window !== "undefined"
    ) {
      router.push("/");
    }

    // if all values are present and the page is not the login page, redirect to login page
    if (
      !serverUrl &&
      !userName &&
      !password &&
      router.pathname !== "/login" &&
      typeof window !== "undefined"
    ) {
      router.push("/login");
    }
  }

  return (
    <div className="font-rubik">
      <RecoilRoot>
        <ThemeProvider themes={["default", "dark", "emerald", "amber"]}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RecoilRoot>
    </div>
  );
}

export default MyApp;
