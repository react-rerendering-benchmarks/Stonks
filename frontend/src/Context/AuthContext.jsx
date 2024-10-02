import { useRef } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { auth } from "../Utils/init-firebase";
import Loader from "../Components/Loader";

// create a context with a placeholder value initially
const AuthContext = createContext();

// custom hook
export const useAuth = () => useContext(AuthContext);

// Provider that wraps our app.js
export default function AuthContextProvider({
  children
}) {
  const currentUser = useRef(null);
  const authLoading = useRef(true);
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }
  function deleteUser(user) {
    return deleteUser(user);
  }
  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email, {
      url: "https://cryptocademy.netlify.app/"
    });
  }
  function updateProfileName(username) {
    return updateProfile(auth.currentUser, {
      displayName: username
    });
  }
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        currentUser.current = user;
        authLoading.current = false;
      } else {
        currentUser.current = null;
        authLoading.current = false;
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const value = {
    currentUser: currentUser.current,
    signUp,
    login,
    logout,
    signInWithGoogle,
    forgotPassword,
    updateProfileName,
    deleteUser
  };
  if (authLoading.current === true) {
    return <Loader message="Checking if you logged in before...." />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}