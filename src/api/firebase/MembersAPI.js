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
  updateDoc,
  arrayUnion,
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
    const docRef = doc(db, collection_name, data.id);
    const payloadData = updateTime
      ? { modifiedAt: serverTimestamp() }
      : { createdAt: serverTimestamp() };
    try {
      if (Object.hasOwn(data.payload, "subscription")) {
        await setDoc(
          docRef,
          { ...data.payload.subscription, ...payloadData },
          {
            merge: true,
          }
        );
        if (Object.hasOwn(data.payload, "payment")) {
          await updateDoc(docRef, {
            payments: arrayUnion({ ...data.payload.payment }),
          });
        }
      } else {
        await setDoc(
          docRef,
          { ...data.payload, ...payloadData },
          {
            merge: true,
          }
        );
      }

      return { success: true, unique_code: data.payload.unique_code };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  // Add Payment
  async setPayment(data) {
    console.log(
      "API CALL =========> set Member--add form data:",
      data.payload,
      " to id:",
      data.id
    );

    try {
      const docRef = doc(db, collection_name, data.id);
      await updateDoc(docRef, {
        payments: arrayUnion({ ...data.payload }),
      });

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
        //where("role", "array-contains", role),
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
  async getMemberById(memberId) {
    try {
      console.log("API CALL =========> getMember by id:", memberId);
      const docRef = doc(db, collection_name, memberId);
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

  async getMemberByPhoneNumber(phoneNumber) {
    try {
      console.log("API CALL =========> getMember by phoneNumber:", phoneNumber);
      const q = query(
        collection(db, collection_name),
        where("contact_no", "==", phoneNumber),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      let memberArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        memberArr.push({ id: doc.id, ...doc.data() });
      });
      console.log("member by phoneNum:", memberArr);
      return { success: true, data: memberArr };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }

  async deleteMember(memberId) {
    try {
      await deleteDoc(doc(db, collection_name, memberId));
      return { success: true };
    } catch (ex) {
      console.log(ex);
      return { success: false, message: ex };
    }
  }
}
