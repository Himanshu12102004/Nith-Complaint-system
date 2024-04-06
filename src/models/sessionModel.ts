import mongoose from 'mongoose';
import { hashPassword } from '../../security/passwords/password';

interface SessionAttributes {
  refreshToken: string;
  deviceFingerprint: string;
}

interface SessionDoc extends mongoose.Document {
  refreshToken: string;
  deviceFingerprint: string;
}

interface SessionModel extends mongoose.Model<SessionDoc> {
  build(attributes: SessionAttributes): SessionDoc;
}

const sessionSchema = new mongoose.Schema<SessionDoc>({
  refreshToken: { type: String, required: true },
  deviceFingerprint: { type: String, required: true },
});

sessionSchema.pre<SessionDoc>('save', async function (next) {
  this.deviceFingerprint = await hashPassword(this.deviceFingerprint);
  next();
});

sessionSchema.statics.build = (sessionAttributes: SessionAttributes) => {
  return new SessionModel(sessionAttributes);
};

const SessionModel = mongoose.model<SessionDoc, SessionModel>(
  'Session',
  sessionSchema
);

export { SessionModel };
