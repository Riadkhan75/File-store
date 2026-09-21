import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import defaultConfig from '../../firebase-applet-config.json';

// Allow admin to view or override config for external deployments (like Vercel)
export const getActiveFirebaseConfig = () => {
  try {
    const customConfig = localStorage.getItem('custom_firebase_config');
    if (customConfig) {
      return JSON.parse(customConfig);
    }
  } catch (e) {
    console.error('Failed to parse custom Firebase config', e);
  }

  // Merge defaultConfig with any environment variables provided by Vercel or Vite
  const env = (import.meta as any).env || {};
  return {
    ...defaultConfig,
    ...(env.VITE_FIREBASE_API_KEY && { apiKey: env.VITE_FIREBASE_API_KEY }),
    ...(env.VITE_FIREBASE_AUTH_DOMAIN && { authDomain: env.VITE_FIREBASE_AUTH_DOMAIN }),
    ...(env.VITE_FIREBASE_PROJECT_ID && { projectId: env.VITE_FIREBASE_PROJECT_ID }),
    ...(env.VITE_FIREBASE_STORAGE_BUCKET && { storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET }),
    ...(env.VITE_FIREBASE_MESSAGING_SENDER_ID && { messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID }),
    ...(env.VITE_FIREBASE_APP_ID && { appId: env.VITE_FIREBASE_APP_ID }),
    ...(env.VITE_FIREBASE_DATABASE_ID && { firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID }),
  };
};

const activeConfig = getActiveFirebaseConfig();

export const app = !getApps().length ? initializeApp(activeConfig) : getApp();

/* CRITICAL: Must pass firestoreDatabaseId if defined */
export const db = getFirestore(
  app,
  activeConfig.firestoreDatabaseId || undefined
);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase skill guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Please check your network or Firebase configuration.');
      return false;
    }
    // Any other permission or not-found error implies the server was reached
    return true;
  }
}
testConnection();
