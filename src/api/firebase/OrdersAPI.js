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
const collection_name = "orders";
export default class OrdersAPI {
  // Add/Update Order
  async setOrder(data) {
    console.log(
      "API CALL =========> Set Order data:",
      data.payload,
      " to id:",
      data.id
    );
    try {
      await setDoc(
        doc(db, collection_name, data.id),
        {...data.payload, modifiedAt: serverTimestamp()},
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

  // Fetch all orders
  async getOrders() {
    try {
      console.log("API CALL =========> getOrders:");
      const q = query(
        collection(db, collection_name),
        orderBy("modifiedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      let orderArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        orderArr.push({id: doc.id, ...doc.data()});
      });
      return {success: true, data: orderArr};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }

  async getOrderDetailById(orderId) {
    console.log("API CALL =========> Get order detail by id:", orderId);
    const docRef = doc(db, collection_name, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("order data:", docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return false;
    }
  }

  async deleteOrder(orderId) {
    try {
      await deleteDoc(doc(db, collection_name, orderId));
      return {success: true};
    } catch (ex) {
      console.log(ex);
      return {success: false, message: ex};
    }
  }
}
