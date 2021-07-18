import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, db } from 'config/firebase';

import firebase from 'firebase';

const authContext = createContext({ user: {} });
const { Provider } = authContext;

// AuthProvider is a Context Provider that wraps our app and makes an auth object
// available to any child component that calls the useAuth() hook.
export function AuthProvider(props: { children: ReactNode }): JSX.Element {
  const auth = useAuthProvider();
  return <Provider value={auth}>{props.children}</Provider>;
}

// useAuth is a hook that enables any component to subscribe to auth state
export const useAuth: any = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
const useAuthProvider = () => {
  const [user, setUser] = useState(null);

  const createUser = async (currentUser: any) => {
    try {
      return db
        .collection('users')
        .doc(currentUser.uid)
        .set({ ...currentUser }, { merge: true });
    } catch (error) {
      return { error };
    }
  };

  const updateUser = async ({ id, data }) => {
    try {
      await db.collection('users').doc(id).update(data);
      setUser({ ...user, ...data });
    } catch (error) {
      return { error };
    }
  };

  const deleteUser = async () => {
    try {
      await auth.currentUser.delete();
      setTimeout(() => setUser(false), 1000);
    } catch (error) {
      return { error };
    }
  };

  const signUp = async ({ name, email, password }, teamId) => {
    try {
      return await auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          auth.currentUser.sendEmailVerification();
          return createUser({
            uid: response.user.uid,
            email,
            name,
            teamId: teamId || '',
            isAdmin: false,
            createdAt: Date.now(),
          });
        });
    } catch (error) {
      return { error };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const {
        user,
        additionalUserInfo,
      } = await auth.signInWithEmailAndPassword(email, password);
      const currentUser = { ...user, additionalUserInfo };
      setUser(currentUser);
      getUserAdditionalData(currentUser);
      return currentUser;
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      return setUser(false);
    } catch (error) {
      return { error };
    }
  };

  const sendPasswordResetEmail = async (email) => {
    const response = await auth.sendPasswordResetEmail(email);
    return response;
  };

  // Get the user data from Firestore
  const getUserAdditionalData = async (user: firebase.User) => {
    db.collection('users')
      .doc(user.uid)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setUser({ ...user, ...doc.data() });
        } else {
          console.log('No such document!');
        }
      });
  };

  /// We need to get the user data from the Firestore db
  const handleAuthStateChanged = (user: firebase.User) => {
    if (user?.uid) {
      setUser(user);
      getUserAdditionalData(user);
    }
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);

    // Unsubscribe on cleanup
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.uid) {
      // Subscribe to user document
      db.collection('users')
        .doc(user.uid)
        .onSnapshot((doc) => setUser(doc.data()));
    }
  }, [user?.uid]);

  return {
    user,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    updateUser,
    deleteUser,
  };
};
