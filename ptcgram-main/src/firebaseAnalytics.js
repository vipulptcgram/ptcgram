import { getAnalytics, isSupported } from 'firebase/analytics'
import { firebaseApp } from './firebaseApp'

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) getAnalytics(firebaseApp)
    })
    .catch(() => {})
}
