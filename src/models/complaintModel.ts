import mongoose, { Schema } from 'mongoose';

export interface ComplaintAttributes {
  lodgedBy: mongoose.Types.ObjectId;
  location: string;
  natureOfComplaint: string;
  subNatureOfComplaint: string;
  description: string;
  currentlyAssignedTo: mongoose.Types.ObjectId;
  tentativeDateOfCompletion: Date;
  historyOfComplaint: [
    {
      assignedTo: mongoose.Types.ObjectId;
      assignedOn: Date;
    }
  ];
}

interface ComplaintDoc extends mongoose.Document {
  lodgedBy: mongoose.Types.ObjectId;
  location: string;
  natureOfComplaint: string;
  subNatureOfComplaint: string;
  description: string;
  currentlyAssignedTo: mongoose.Types.ObjectId;
  tentativeDateOfCompletion: Date;
  lodgedOn: Date;
  isComplete: boolean;
  complaintId: number;
  historyOfComplaint: [
    {
      assignedTo: mongoose.Types.ObjectId;
      assignedOn: Date;
    }
  ];
}

interface ComplaintModel extends mongoose.Model<ComplaintDoc> {
  build(attributes: ComplaintAttributes): ComplaintDoc;
}
const getComplaintId = () => {
  const min = 1000000000;
  const max = 9999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const complaintSchema = new mongoose.Schema<ComplaintDoc>({
  lodgedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  natureOfComplaint: { type: String, required: true },
  subNatureOfComplaint: { type: String, required: true },
  description: { type: String, default: '' },
  currentlyAssignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tentativeDateOfCompletion: { type: Date, required: true },
  lodgedOn: { type: Date, default: Date.now },
  complaintId: { type: Number, default: getComplaintId },
  isComplete: { type: Boolean, default: false },
  historyOfComplaint: [
    {
      assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      assignedOn: { type: Date, default: Date.now },
    },
  ],
});

complaintSchema.statics.build = (attributes: ComplaintAttributes) => {
  return new ComplaintModel(attributes);
};

const ComplaintModel = mongoose.model<ComplaintDoc, ComplaintModel>(
  'Complaint',
  complaintSchema
);

export { ComplaintModel };
