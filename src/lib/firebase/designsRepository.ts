import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { parseRingConfig, type RingConfig } from '../ringConfig';
import { withTimeout } from '../withTimeout';
import { getFirestoreClient } from './firestoreClient';

const DESIGNS_COLLECTION = 'designs';

// Bump together with firestore.rules if the stored shape ever changes.
const DESIGN_SCHEMA_VERSION = 1;

// Firestore keeps offline writes pending indefinitely; give up and tell the user instead.
const FIRESTORE_REQUEST_TIMEOUT_MS = 15_000;

export type LoadDesignResult = { kind: 'found'; config: RingConfig } | { kind: 'not-found' } | { kind: 'invalid' };

export async function saveDesign(config: RingConfig): Promise<string> {
  const validConfig = parseRingConfig(config);
  if (!validConfig) throw new Error('This design has values outside the allowed ranges.');

  const designs = collection(getFirestoreClient(), DESIGNS_COLLECTION);
  const reference = await withTimeout(
    addDoc(designs, { schemaVersion: DESIGN_SCHEMA_VERSION, ...validConfig, createdAt: serverTimestamp() }),
    FIRESTORE_REQUEST_TIMEOUT_MS,
    'Saving took too long. Check your connection and try again.',
  );
  return reference.id;
}

export async function loadDesign(designId: string): Promise<LoadDesignResult> {
  const snapshot = await withTimeout(
    getDoc(doc(getFirestoreClient(), DESIGNS_COLLECTION, designId)),
    FIRESTORE_REQUEST_TIMEOUT_MS,
    'Loading took too long. Check your connection and try again.',
  );
  if (!snapshot.exists()) return { kind: 'not-found' };

  const config = parseRingConfig(snapshot.data());
  return config ? { kind: 'found', config } : { kind: 'invalid' };
}
