import { Subject } from 'rxjs'

let db

const firebaseConfig = {
  apiKey: 'AIzaSyAibUJ8KTQ4rB-zGV2lrpsKDcupxMeueSs',
  authDomain: 'tetris-d93a1.firebaseapp.com',
  databaseURL: 'https://tetris-d93a1.firebaseio.com',
  projectId: 'tetris-d93a1',
  storageBucket: 'tetris-d93a1.appspot.com',
  messagingSenderId: '83809642806',
  appId: '1:83809642806:web:ea4f2be775257663'
}

const scoresSnapshotCallbacks = []

import('firebase/app').then(async firebase => {
  await import('firebase/firestore')
  firebase.initializeApp(firebaseConfig)
  db = firebase.firestore()
  db.collection('scores')
    .limit(20)
    .orderBy('score', 'desc')
    .onSnapshot(onScoresSnapshot)
})

function onScoresSnapshot(snapshot) {
  const scores = []
  snapshot.forEach(doc => {
    scores.push({ ...doc.data(), id: doc.id })
  })
  scoresSubject.next(scores)
}

export const scoresSubject = new Subject()

export async function addScore({ name, score }) {
  try {
    await db.collection('scores').add({
      name,
      score
    })
  } catch (error) {
    console.error(error)
  }
}

