import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface MaterialAttributes {
  name: string;
  quantity: number;
  unitOfQuantity: string;
  materialCategoryID: Types.ObjectId;
  transactions: Types.ObjectId[];
}

interface MaterialDoc extends Document {
  name: string;
  quantity: number;
  unitOfQuantity: string;
  materialCategoryID: Types.ObjectId;
  transactions: Types.ObjectId[];
}

interface MaterialModel extends Model<MaterialDoc> {
  build(attributes: MaterialAttributes): MaterialDoc;
}

const MaterialSchema = new Schema<MaterialDoc>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitOfQuantity: { type: String, required: true },
  materialCategoryID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'MaterialCategory',
  },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
});

MaterialSchema.statics.build = function (attributes: MaterialAttributes) {
  return new this(attributes);
};

const MaterialModel = mongoose.model<MaterialDoc, MaterialModel>(
  'Material',
  MaterialSchema
);

export { MaterialModel, MaterialAttributes };
