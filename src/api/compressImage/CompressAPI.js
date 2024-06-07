import Compress from "compress.js";
export default class CompressAPI {
  ///// Compresse image and return blob data /////////
  async compressImage(img, props) {
    try {
      const compress = new Compress();
      const img_data = await compress.compress([img], props);
      return { success: true, data: img_data[0] };
    } catch (ex) {
      return { success: false, message: ex };
    }

    //return res;
  }
  ///// Convert base64 to file and return FILE /////////
  base64ToImage(base64str, imageExt) {
    try {
      const imgRes = Compress.convertBase64ToFile(base64str, imageExt);
      return { success: true, data: imgRes };
    } catch (ex) {
      console.log("base64ToImage Error:", ex);
      return { success: false, message: ex };
    }
  }
}
