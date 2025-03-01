import PurchasesModel from "~/server/models/Purchases";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { id_user: data.userid };
    let query = PurchasesModel.find(obj).sort({ _id: -1 });

    if (data.lastitem) {
      query = query.limit(parseInt(data.lastitem));
    }

    const result = await query;
    return result;
  } catch (err) {
    console.log(err);
  }
});
