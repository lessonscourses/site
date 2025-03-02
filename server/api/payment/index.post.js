import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const public_key = "e48be84b1da083c88071ac754c4cd909";
  const secret_key = "9cbc01ea642190a0c7e5b511c27a5801";

  let data = {
    amount: body.amount,
    orderId: body.orderId,
    paymentSystem: "Pay",
  };

  // Формируем подпись
  let sign = Object.values(data).join("") + secret_key;
  data.sign = crypto.createHash("md5").update(sign).digest("hex");

  try {
    const response = await fetch(
      "https://merchant.betatransfer.io/api/payment?token=" + public_key,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data),
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return { status: "error", message: error.message };
  }
});
