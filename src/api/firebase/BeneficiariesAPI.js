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
} from "firebase/firestore";
import {db} from "../../firebase";
const collection_name = "beneficiaries";

export default class BeneficiariesAPI {
  // Add/Update Beneficiary
  async setBeneficiary(data, updateTime = true) {
    console.log(
      "API CALL =========> set Beneficiary--add form data:",
      data.payload,
      " to id:",
      data.id
    );
    const payloadData = updateTime ? {createdAt: serverTimestamp()} : {};
    try {
      await setDoc(
        doc(db, collection_name, data.id),
        {...data.payload, ...payloadData},
        {
          merge: true,
        }
      );
      return {success: true};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }

  // Fetch all beneficiaries
  async getBeneficiaries() {
    try {
      console.log("API CALL =========> getBeneficiaries:");
      const q = query(
        collection(db, collection_name),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      let proArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        proArr.push({id: doc.id, ...doc.data()});
      });
      console.log("beneficiaries:", proArr);
      return {success: true, data: proArr};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }

  async checkIfBeneficiaryInDB(beneficiaryId) {
    console.log(
      "API CALL =========> Check if beneficiary added in db:",
      beneficiaryId
    );
    const docRef = doc(db, "beneficiaries", beneficiaryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("beneficiary already in db :", docSnap.data());
      return true;
    } else {
      // doc.data() will be undefined in this case
      console.log("Beneficiary not added in db!");
      return false;
    }
  }
  // Fetch beneficiary by id
  async getBeneficiaryById(prodId) {
    try {
      console.log("API CALL =========> getBeneficiary by id:", prodId);
      const docRef = doc(db, collection_name, prodId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("beneficiary data:", docSnap.data());
        return {success: true, data: docSnap.data()};
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return {success: false, message: "No Beneficiary Found"};
      }
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }

  async deleteBeneficiary(prodId) {
    try {
      await deleteDoc(doc(db, collection_name, prodId));
      return {success: true};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }
}
