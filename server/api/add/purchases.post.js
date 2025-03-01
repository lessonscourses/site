import PurchasesModel from "~/server/models/Purchases";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const purchases = await PurchasesModel.create(data);
    return purchases;
  } catch (err) {
    console.log(err);
  }
});
