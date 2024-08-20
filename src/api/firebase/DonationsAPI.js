import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  getDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  getAggregateFromServer,
  sum,
} from "firebase/firestore";
import { db } from "../../firebase";
const collection_name = "donationGiven";

export default class DonationsAPI {
  // Add/Update Beneficiary
  async setDonation(data, updateTime = true) {
    console.log(
      "API CALL =========> Add Donation Given:",
      data.payload,
      " to id:",
      data.id
    );
    const payloadData = updateTime ? { createdAt: serverTimestamp() } : {};
    try {
      await setDoc(
        doc(db, collection_name, data.id),
        { ...data.payload, ...payloadData },
        {
          merge: true,
        }
      );
      return { success: true };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  // Fetch all beneficiaries
  async getDonations() {
    try {
      console.log("API CALL =========> get all Donations Given:");
      const q = query(
        collection(db, collection_name),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      let donationsArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        donationsArr.push({ id: doc.id, ...doc.data() });
      });
      console.log("donations:", donationsArr);
      return { success: true, data: donationsArr };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  async totalDonatedAmount() {
    try {
      console.log("API CALL =========> get totalDonatedAmount:");
      const q = query(collection(db, collection_name));
      const querySnapshot = await getAggregateFromServer(q, {
        totalAmount: sum("amount"),
      });

      console.log("total amount donated:", querySnapshot.data().totalAmount);
      return { success: true, data: querySnapshot.data().totalAmount };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }
  // Fetch beneficiary by id
  async getDonationDetailById(donationId) {
    try {
      console.log("API CALL =========> get Donation by id:", donationId);
      const docRef = doc(db, collection_name, donationId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("donation data:", docSnap.data());
        return { success: true, data: docSnap.data() };
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return { success: false, message: "No Donation Found" };
      }
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  async deleteDonation(donationId) {
    try {
      await deleteDoc(doc(db, collection_name, donationId));
      return { success: true };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }
}
