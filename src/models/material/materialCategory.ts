import mongoose, { Schema, Document, Model } from 'mongoose';

interface MaterialCategoryAttributes {
  name: string;
}

interface MaterialCategoryDoc extends Document {
  name: string;
}

interface MaterialCategoryModel extends Model<MaterialCategoryDoc> {
  build(attributes: MaterialCategoryAttributes): MaterialCategoryDoc;
}

const MaterialCategorySchema = new Schema<MaterialCategoryDoc>({
  name: { type: String, required: true },
});

MaterialCategorySchema.statics.build = function (
  materialCategoryAttributes: MaterialCategoryAttributes
) {
  return new this(materialCategoryAttributes);
};

const MaterialCategoryModel = mongoose.model<
  MaterialCategoryDoc,
  MaterialCategoryModel
>('MaterialCategory', MaterialCategorySchema);

export { MaterialCategoryModel, MaterialCategoryAttributes };
