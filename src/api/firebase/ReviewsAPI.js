import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import {db} from "../../firebase";
const table = "reviews";
export default class ReviewsAPI {
  // Add/Update Review
  async setReview(data) {
    console.log(
      "API CALL =========> set review---add review data:",
      data.payload,
      " to id:",
      data.id
    );
    try {
      await setDoc(
        doc(db, table, data.id),
        {...data.payload, createdAt: serverTimestamp()},
        {
          merge: true,
        }
      );
      return {
        success: true,
        data: {...data.payload, createdAt: serverTimestamp()},
      };
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }

  // Fetch all reviews
  async getReviews() {
    try {
      console.log("API CALL =========> getReviews:");
      const q = query(collection(db, table));
      const querySnapshot = await getDocs(q);
      let reviewArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        reviewArr.push({id: doc.id, ...doc.data()});
      });
      return {success: true, data: reviewArr};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }
  async getReviewDetailById(reviewId) {
    console.log("API CALL =========> Get review detail by id:", reviewId);
    const docRef = doc(db, table, reviewId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("review data:", docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return false;
    }
  }
  async deleteReview(reviewId) {
    try {
      await deleteDoc(doc(db, table, reviewId));
      return {success: true};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }
}
