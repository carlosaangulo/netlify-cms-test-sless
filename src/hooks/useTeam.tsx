import * as teamService from 'services/team';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, db } from 'config/firebase';

import firebase from 'firebase';

const authContext = createContext({ team: {} });
const { Provider } = authContext;

// TeamProvider is a Context Provider that wraps our app and makes an team object
// available to any child component that calls the useTeam() hook.
export function TeamProvider(props: { children: ReactNode }): JSX.Element {
  const team = useTeamProvider();
  return <Provider value={team}>{props.children}</Provider>;
}

// useTeam is a hook that enables any component to subscribe to team state
export const useTeam: any = () => {
  return useContext(authContext);
};

// Provider hook that creates team object and handles state
const useTeamProvider = () => {
  const [team, setTeam] = useState(null);

  /// We need to get the team data from the db
  const handleAuthStateChanged = async (user: firebase.User) => {
    if (user?.uid && !team) {
      db.collection('users')
        .doc(user.uid)
        .onSnapshot(async (doc) => {
          const teamId = doc.data()?.teamId;
          if (teamId) {
            const team = await teamService.getTeam(teamId);
            setTeam(team);
          }
        });
    }
  };

  useEffect(() => {
    // Subscribe to auth state
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);

    // Unsubscribe on cleanup
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Subscribe to team on mount
    if (team?.id) {
      db.collection('teams')
        .doc(team.id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setTeam(doc.data());
          }
        });
    }
  }, [team?.id]);

  return {
    team,
  };
};
