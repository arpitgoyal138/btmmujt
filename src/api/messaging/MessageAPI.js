const baseUrl = "https://payments.inproveda.com/public/api";
export default class MessageAPI {
  async sendEmail(mailData) {
    const url = baseUrl + "/sendmail";
    const auth_key = process.env.REACT_APP_MSG_91_AUTH_KEY;
    const toData = { toName: "Arpit G", toEmail: "arpitgoyal138@gmail.com" };
    const data = JSON.stringify(toData);

    console.log("auth_key:", auth_key);
    console.log("bodyData:", data);

    try {
      await fetch(url, {
        method: "POST",
        body: data,
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log("data:", data);
          return { success: true, data: data };
        });
    } catch (error) {
      console.log("Server Error:", error);
      return { success: false, message: error };
    }
  }
}
