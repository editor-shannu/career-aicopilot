// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtFfQ1lTZcc5rulSz6ZuaJyR85-315xZQ",
  authDomain: "career-aicopilot.firebaseapp.com",
  projectId: "career-aicopilot",
  storageBucket: "career-aicopilot.firebasestorage.app",
  messagingSenderId: "66053169088",
  appId: "1:66053169088:web:f9b69a21adfeff7a24b225",
  measurementId: "G-GRN7Q9RGD0"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialized");
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error("Firebase Initialization Error", err);
    }
}

const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// --- Auth Helpers ---

window.handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        // Try Popup first
        const result = await auth.signInWithPopup(provider);
        return result.user;
    } catch (error) {
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            console.warn("Popup blocked or closed, falling back to redirect...", error);
            try {
                // Fallback to Redirect
                await auth.signInWithRedirect(provider);
                // This promise will not resolve as the page redirects
                return null; 
            } catch (redirectError) {
                console.error("Redirect Login Failed", redirectError);
                throw redirectError;
            }
        }
        console.error("Login Failed", error);
        throw error;
    }
};

window.handleLogout = async () => {
    try {
        await auth.signOut();
        window.location.reload();
    } catch (error) {
        console.error("Logout Failed", error);
    }
};

// --- Database Helpers ---

// Ensure user document exists (Safe to call multiple times)
window.ensureUserDoc = async (user) => {
    if (!user) return;
    try {
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            await userRef.set({
                uid: user.uid,
                name: user.displayName || 'Anonymous',
                email: user.email || '',
                photoURL: user.photoURL || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("User document created");
        }
    } catch (error) {
        console.error("Error ensuring user doc:", error);
    }
};

// Save career progress data
window.saveUserProgress = async (uid, data) => {
    if (!uid) return;
    try {
        const userRef = db.collection('users').doc(uid);
        await userRef.set({
            ...data,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("Progress Saved to Firestore");
    } catch (error) {
        console.error("Error saving progress", error);
    }
};

// Fetch user data
window.fetchUserData = async (uid) => {
    if (!uid) return null;
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data", error);
        return null;
    }
};

// Listen for auth state
window.onAuthStateChange = (callback) => {
    return auth.onAuthStateChanged(callback);
};