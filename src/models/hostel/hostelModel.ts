import mongoose from 'mongoose';

export interface HostelAttributes {
  name: string;
}

export interface HostelDoc extends mongoose.Document {
  name: string;
  createdOn: Date;
}

interface HostelModel extends mongoose.Model<HostelDoc> {
  build(attributes: HostelAttributes): HostelDoc;
}

const hostelSchema = new mongoose.Schema<HostelDoc>({
  name: {
    type: String,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

hostelSchema.statics.build = (attributes: HostelAttributes) => {
  return new HostelModel(attributes);
};

const HostelModel = mongoose.model<HostelDoc, HostelModel>(
  'hostel',
  hostelSchema
);

export { HostelModel };
