import mongoose from 'mongoose';
import { hashPassword } from '../../security/passwords/password';

interface SessionAttributes {
  refreshToken: string;
  deviceFingerprint: string;
  operatingSystem: string;
}

interface SessionDoc extends mongoose.Document {
  refreshToken: string;
  deviceFingerprint: string;
  operatingSystem: string;
  loggedInOn: Date;
}

interface SessionModel extends mongoose.Model<SessionDoc> {
  build(attributes: SessionAttributes): SessionDoc;
}

const sessionSchema = new mongoose.Schema<SessionDoc>({
  refreshToken: { type: String, required: true },
  deviceFingerprint: { type: String, required: true },
  operatingSystem: { type: String, default: 'unknown' },
  loggedInOn: { type: Date, default: Date.now },
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
