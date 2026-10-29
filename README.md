 # Gurukul Budget Management

 Enterprise budget management UI built with Vite, React, TypeScript, and Firebase.

 ## Architecture

 - Firebase Authentication is the only identity source.
 - Cloud Firestore is the primary database: `users`, `departments`, `budgets`, and `expenses`.
 - Realtime Database is not used because the current dashboard does not require streaming updates.
 - Storage is not used because there is no file or image upload workflow.
 - Firebase Hosting configuration is in `firebase.json`.
 - No Node server, Express, Socket.IO, WebRTC, TURN, AWS, SQL, or external database is included.

 ## Firestore model

 `users/{uid}` stores the role (`admin`, `finance-manager`, `department-manager`, or `viewer`) and optional department membership. Budgets reference `departmentId` and `createdBy`; expenses reference `departmentId` and `submittedBy`. Security rules enforce access by authenticated identity, role, and department rather than browser-supplied permissions.

 Required composite indexes are tracked in `firestore.indexes.json`.

 ## Local setup

 1. Copy `.env.example` to `.env.local`.
 2. Create a Firebase project using the no-cost Spark plan.
 3. Enable Email/Password Authentication and Cloud Firestore.
 4. Fill in the `VITE_FIREBASE_*` values from Firebase web app settings.
 5. Run `npm install` and `npm run dev`.

 Without Firebase environment values, the visual prototype still loads with local demo data. Firebase services fail closed with a clear configuration error rather than using an alternate backend.

 ## Validation

 - `npm run typecheck`
 - `npm run build`
 - `npm run lint` may be unavailable on locked-down Windows environments when the native Oxlint binding is blocked by Application Control policy.
