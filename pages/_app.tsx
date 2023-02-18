import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import { RecoilRoot, useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import { ThemeProvider } from "next-themes";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  const userRef = collection(db, "users");
  useEffect(() => {
    if (user) {
      setDoc(
        doc(userRef, user.uid),
        {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          lastSeen: serverTimestamp(),
          uid: user.uid,
        },
        { merge: true }
      );
    }
  }, [user]);

  return (
    <div className="font-poppins">
      <RecoilRoot>
        <ThemeProvider attribute="class">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RecoilRoot>
    </div>
  );
}

export default MyApp;
