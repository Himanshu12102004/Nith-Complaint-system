import mongoose, { Schema } from 'mongoose';
export interface NatureAttributes {
  nature: string;
  subNature: string[];
}
export interface NatureDoc extends mongoose.Document {
  nature: { isActive: boolean; name: string };
  subNature: [{ isActive: boolean; name: string }];
}
interface NatureModel extends mongoose.Model<NatureDoc> {
  build(attributes: NatureAttributes): NatureDoc;
}
const natureSchema = new mongoose.Schema<NatureDoc>({
  nature: {
    isActive: { type: Boolean, default: true },
    name: { type: String },
  },
  subNature: [
    { isActive: { type: Boolean, default: true }, name: { type: String } },
  ],
});
natureSchema.statics.build = (attributes: NatureAttributes) => {
  const subNaturesModified = attributes.subNature.map((element) => {
    return { name: element, isActive: true };
  });
  return new NatureModel({
    nature: { isActive: true, name: attributes.nature },
    subNature: subNaturesModified,
  });
};
const NatureModel = mongoose.model<NatureDoc, NatureModel>(
  'nature',
  natureSchema
);
export { NatureModel };
