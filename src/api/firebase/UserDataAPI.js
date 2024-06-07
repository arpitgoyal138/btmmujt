import {db} from "../../firebase";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
const table = "users";
export default class UserDataAPI {
  // Add/Edit User Personal Data
  async addUserData(data, updateTime = false) {
    const payloadData = updateTime ? {createdAt: serverTimestamp()} : {};
    console.log(
      "API CALL =========> add user data:",
      data.payload,
      " to id:",
      data.id
    );
    try {
      await setDoc(
        doc(db, table, data.id),
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
}
