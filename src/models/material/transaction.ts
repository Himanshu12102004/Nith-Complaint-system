import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface TransactionAttributes {
  userId: Types.ObjectId;
  materialId: Types.ObjectId; // Added field to store the MongoDB _id of the material
  amountChanged: number;
  complaintId?: Types.ObjectId;
}

interface TransactionDoc extends Document {
  userId: Types.ObjectId;
  materialId: Types.ObjectId;
  time: Date;
  amountChanged: number;
  complaintId?: Types.ObjectId;
}

interface TransactionModel extends Model<TransactionDoc> {
  build(attributes: TransactionAttributes): TransactionDoc;
}

const TransactionSchema = new Schema<TransactionDoc>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  materialId: { type: Schema.Types.ObjectId, required: true, ref: 'Material' }, // Added field for material ID
  time: { type: Date, default: Date.now },
  amountChanged: { type: Number, required: true },
  complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint' },
});

TransactionSchema.statics.build = function (attributes: TransactionAttributes) {
  return new this(attributes);
};

const TransactionModel = mongoose.model<TransactionDoc, TransactionModel>(
  'Transaction',
  TransactionSchema
);

export { TransactionModel, TransactionAttributes };
