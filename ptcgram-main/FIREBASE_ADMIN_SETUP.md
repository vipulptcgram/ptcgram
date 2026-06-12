# Firebase Admin Setup

The admin panel is available at `/admin`.

## 1. Enable Authentication

1. Open Firebase Console for `ptcgrammain`.
2. Go to **Authentication > Sign-in method**.
3. Enable **Email/Password**.
4. Go to **Authentication > Users** and create the administrator account.

## 2. Create Firestore

1. Go to **Firestore Database**.
2. Create the database in production mode.
3. Open the administrator in **Authentication > Users** and copy its UID.
4. In Firestore, create a collection named `users`.
5. Create a document whose document ID is the administrator UID.
6. Add a string field named `role` with the value `admin`.

The record must look like:

```text
users/{AUTH_USER_UID}
  role: "admin"
```

## 3. Enable Storage

1. Go to **Storage** in Firebase Console.
2. Click **Get started** and create the default Storage bucket.
3. Keep the bucket location appropriate for your visitors.

## 4. Deploy Security Rules

Install and authenticate the Firebase CLI, then run:

```powershell
npm install -g firebase-tools
firebase login
firebase use ptcgrammain
firebase deploy --only firestore:rules,storage
```

The included rules allow public product, category, and image reads. Product/category writes and image uploads are restricted to approved administrators. Gallery uploads accept images up to 8 MB each.

## 5. Import Existing Products

1. Open `/admin`.
2. Sign in with the administrator account.
3. Click **Import JSON Catalog** once.

The public product pages will then use Firestore data. Until products are imported, they continue using the bundled JSON catalog.
