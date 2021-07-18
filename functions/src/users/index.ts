import * as functions from 'firebase-functions';
import { addTeamMember, createTeam } from '../teams';
import { sendWelcomeEmail } from '../emails';
import { db, storage } from '../config';

/**
 * On user create, check if teamId is present and if so, update the
 * users array of the corresponding team
 */
export const onUserCreate = functions.firestore
  .document('/users/{documentId}')
  .onCreate(async (snap) => {
    const user = snap.data();

    // If the teamId is present, that means the user signed up from a team invite mail
    if (user.teamId) {
      await addTeamMember(user);

      // Here, you could also send an email to the owner to inform about team member joining
    } else {
      await createTeam(user);
    }

    await sendWelcomeEmail(user);

    return { status: 'success' };
  });

/**
 * Updates the user document non-destructively
 */
export const updateUser = async (
  uid: string,
  data: { [key: string]: any }
): Promise<FirebaseFirestore.WriteResult> => {
  return await db.collection('users').doc(uid).set(data, { merge: true });
};

/*
 * The onUserDelete function removes personal data from
 * Storage, and Firestore. It waits for all deletions to complete, and then
 * returns a success message.
 */
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const firestorePaths = 'users/{UID},teams/{UID}';
  const storagePaths = 'users/{UID}';
  const { uid } = user;
  const promises = [];

  if (firestorePaths) {
    promises.push(clearFirestoreData(firestorePaths, uid));
  }
  if (storagePaths) {
    promises.push(clearStorageData(storagePaths, uid));
  }

  await Promise.all(promises);
});

const clearStorageData = async (storagePaths: string, uid: string) => {
  const paths = extractUserPaths(storagePaths, uid);
  const promises = paths.map(async (path) => {
    const parts = path.split('/');
    const bucketName = parts[0];
    const bucket =
      bucketName === '{DEFAULT}'
        ? storage.bucket()
        : storage.bucket(bucketName);
    const prefix = parts.slice(1).join('/');
    try {
      await bucket.deleteFiles({
        prefix,
      });
    } catch (error) {
      console.log(error);
    }
  });

  await Promise.all(promises);
};

const clearFirestoreData = async (firestorePaths: string, uid: string) => {
  const paths = extractUserPaths(firestorePaths, uid);
  const promises = paths.map(async (path) => {
    try {
      await db.runTransaction((transaction) => {
        transaction.delete(db.doc(path));
        return Promise.resolve();
      });
    } catch (error) {
      console.log(error);
    }
  });

  await Promise.all(promises);
};

const extractUserPaths = (paths: string, uid: string) => {
  return paths.split(',').map((path) => replaceUID(path, uid));
};

const replaceUID = (path: string, uid: string) => {
  return path.replace(/{UID}/g, uid);
};
