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
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
const collection_name = "members";

export default class MembersAPI {
  // Add/Update Member
  async setMember(data, updateTime = false) {
    console.log(
      "API CALL =========> set Member--add form data:",
      data.payload,
      " to id:",
      data.id
    );
    const payloadData = updateTime
      ? { modifiedAt: serverTimestamp() }
      : { createdAt: serverTimestamp() };
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

  // Fetch all members
  async getMembers() {
    try {
      console.log("API CALL =========> getMembers:");
      const q = query(
        collection(db, collection_name),
        // where("post_name", "==", "सदस्य"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      let proArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        proArr.push({ id: doc.id, ...doc.data() });
      });
      console.log("members:", proArr);
      return { success: true, data: proArr };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  // Fetch all managers
  async getManagers() {
    try {
      console.log("API CALL =========> getManagers:");
      const q = query(
        collection(db, collection_name),
        where("post_name", "!=", "सदस्य"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      let proArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        proArr.push({ id: doc.id, ...doc.data() });
      });
      console.log("managers:", proArr);
      return { success: true, data: proArr };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  async checkIfMemberInDB(memberId) {
    console.log("API CALL =========> Check if member added in db:", memberId);
    const docRef = doc(db, "members", memberId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("member already in db :", docSnap.data());
      return true;
    } else {
      // doc.data() will be undefined in this case
      console.log("Member not added in db!");
      return false;
    }
  }
  // Fetch member by id
  async getMemberById(prodId) {
    try {
      console.log("API CALL =========> getMember by id:", prodId);
      const docRef = doc(db, collection_name, prodId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("member data:", docSnap.data());
        return { success: true, data: docSnap.data() };
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return { success: false, message: "No Member Found" };
      }
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  async deleteMember(prodId) {
    try {
      await deleteDoc(doc(db, collection_name, prodId));
      return { success: true };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }
}
