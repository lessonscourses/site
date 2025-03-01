import mongoose from "mongoose";

const purchasesScema = new mongoose.Schema({
  id_user: { type: String, require: true, trim: true },
  tariff: { type: String, require: true, trim: true },
  date_payment: { type: Date, default: Date.now },
  expiration_date: { type: Date, default: Date.now },
  cost: { type: String, require: true, trim: true },
  currency: { type: String, require: true, trim: true },
  mount: { type: String, require: true, trim: true },
  status: { type: String, require: true, trim: true },
  order: { type: String, require: true, trim: true },
});

const PurchasesModel = mongoose.model("purchases", purchasesScema);

export default PurchasesModel;
