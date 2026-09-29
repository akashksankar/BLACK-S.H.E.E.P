/**
 * BLACK S.H.E.E.P. - Firebase Client Initialization & Firestore Connection
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_health', 'test'));
    console.log('[Firestore] Database connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Please check your Firebase configuration.');
    }
  }
}
