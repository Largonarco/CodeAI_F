import { initializeApp } from "firebase/app";
import {
	getAuth,
	signOut,
	setPersistence,
	signInWithPopup,
	GoogleAuthProvider,
	browserLocalPersistence,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Init Firebase App
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence).catch((error) => {
	throw { code: error.code, message: error.message };
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Authentication services
export const FirebaseService = {
	// Email/Password signup
	async signUpWithEmail(email: string, password: string) {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			return user;
		} catch (error: any) {
			throw error;
		}
	},
	// Email/Password login
	async loginWithEmail(email: string, password: string) {
		try {
			// Sign in with Firebase
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			return user;
		} catch (error: any) {
			throw error;
		}
	},
	// Google Sign-in
	async signInWithGoogle() {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;

			return user;
		} catch (error: any) {
			throw error;
		}
	},
	// Logout
	async logout() {
		try {
			await signOut(auth);
			localStorage.removeItem("user");
		} catch (error: any) {
			throw error;
		}
	},
	// Get current authenticated user
	getCurrentUser() {
		return new Promise((resolve, reject) => {
			const unsubscribe = auth.onAuthStateChanged((user) => {
				unsubscribe();
				resolve(user);
			}, reject);
		});
	},
	// Get auth token for API calls
	async getAuthToken() {
		const user = auth.currentUser;
		if (!user) {
			throw new Error("No authenticated user found");
		}
		return user.getIdToken();
	},
	// Run the agent workflow with authentication
	async runAgentWorkflow(request: string, githubToken: string | null) {
		try {
			const authToken = await this.getAuthToken();

			const response = await fetch(`${API_BASE_URL}/agent/run`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
				body: JSON.stringify({
					request,
					github_token: githubToken,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || "Failed to run agent workflow");
			}

			return await response.json();
		} catch (error: any) {
			console.error("Error running agent workflow:", error);
			throw error;
		}
	},
};

export default FirebaseService;
