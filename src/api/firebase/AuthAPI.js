import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {auth, db} from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  getDocs,
  orderBy,
} from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
export default class AuthAPI {
  setUserInTable(user) {
    console.log("API CALL =========> setUserInTable:", user);
    try {
      const res = setDoc(
        doc(db, "users", user.id),
        {...user.payload},
        {
          merge: true,
        }
      );
      return res;
    } catch (ex) {
      console.log("ERROR: ", ex);
    }
  }
  async getUserDetailById(userId) {
    console.log("API CALL =========> Get user detail by id:", userId);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("user data:", docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return false;
    }
  }
  async checkIfUserInDB(userId) {
    console.log("API CALL =========> Check if user added in db:", userId);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("user already in db :", docSnap.data());
      return true;
    } else {
      // doc.data() will be undefined in this case
      console.log("User not added in db!");
      return false;
    }
  }
  signInWithGoogle() {
    try {
      const promise = signInWithPopup(auth, googleProvider);
      promise.then((res) => {
        console.log("signInWithGoogle user in :", res.user);
      });
      return promise;
    } catch (ex) {
      return {success: false, error: {errorCode: "405", errorMessage: ex}};
    }
  }
  signUpWithEmailPassword(name, email, password) {
    try {
      const promise = createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("Created user:", user);

          const userDetail = {
            id: user.uid,
            payload: {
              displayName: name,
              email: email,
              role: ["User"],
              createdAt: new Date().toString(),
            },
          };
          this.setUserInTable(userDetail);
          return {status: true, data: user};
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("errorCode:", errorCode);
          console.log("errorMessage:", errorMessage);
          return {status: false, error: error};
          // ..
        });
      return promise;
    } catch (ex) {}
  }
  signInWithEmailPassword(email, password) {
    try {
      const promise = signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("Signed user:", user);
          return {status: true, data: user};
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("errorCode:", errorCode);
          console.log("errorMessage:", errorMessage);
          return {status: false, error: error};
        });
      return promise;
    } catch (ex) {}
  }
  //Observer for Auth state(Signed In/Signed out)
  getAuthState() {
    try {
      console.log("checking auth state");
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log("User signed in:", user);
          // ...
        } else {
          // User is signed out
          console.log("User signed out");

          // ...
        }
      });
    } catch (ex) {}
  }
  getUserProfile() {
    console.log("Get user profile");
    try {
      const user = auth.currentUser;
      if (user !== null) {
        const userId = user.uid || user.id;
        console.log("Get user profile by Id:", userId);

        this.getUserDetailById(userId).then((res) => {
          console.log("user profile:", res);
        });
      }
    } catch (ex) {}
  }
  signoutUser() {
    try {
      return auth.signOut();
    } catch (ex) {}
  }
  async getAllUsers() {
    try {
      console.log("API CALL =========> get all users");
      ///////////// Get data once
      const q = query(collection(db, "users"), orderBy("displayName"));

      const querySnapshot = await getDocs(q);
      let userArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        userArr.push({id: doc.id, ...doc.data()});
      });
      return {success: true, data: userArr};
    } catch (ex) {
      console.log("ERROR:", ex);
    }
  }
  sendResetPasswordLinkOnEmail(email) {
    try {
      console.log(
        "API CALL =========> send password reset link on Email:",
        email
      );
      sendPasswordResetEmail(auth, email)
        .then((res) => {
          console.log("Email sent:", res);
          return res;
        })
        .catch((err) => {
          console.log("Email couldnt send:", err);
          return err;
        });
    } catch (ex) {}
  }
}
