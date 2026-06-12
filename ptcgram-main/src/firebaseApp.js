import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAM__qTNTJwonKFWTza9pGZPRHasENxw_E',
  authDomain: 'ptcgrammain.firebaseapp.com',
  projectId: 'ptcgrammain',
  storageBucket: 'ptcgrammain.firebasestorage.app',
  messagingSenderId: '427711736401',
  appId: '1:427711736401:web:388f8554152960ce37a670',
  measurementId: 'G-S2G16FZDR7',
}

export const firebaseApp = initializeApp(firebaseConfig)
