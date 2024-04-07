import mongoose, { Schema } from 'mongoose';
import { encrypt } from '../../security/secrets/encrypt';
import { decrypt } from '../../security/secrets/decrypt';
import { hashPassword } from '../../security/passwords/password';
import { Designations } from '../types/types';
import { Custom_error } from '@himanshu_guptaorg/utils';
interface UserAttributes {
  name: string;
  phone: string;
  email: string;
  designation: Designations;
  hostel: string;
  department: string;
  password: string;
}
interface UserDoc extends mongoose.Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  designation: string;
  hostel: string;
  department: string;
  complaints: Schema.Types.ObjectId[];
  assignedComplaints: Schema.Types.ObjectId[];
  isVerifiedByCEE: Boolean;
  sessions: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
  find_one(
    who_to_find: {
      email?: string;
      phone?: string;
    },
    select?: string
  ): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    hostel: { type: String, default: 'null' },
    department: { type: String, default: 'null' },
    password: { type: String, required: true },
    complaints: [{ type: Schema.Types.ObjectId, ref: 'Complaint' }],
    assignedComplaints: [{ type: Schema.Types.ObjectId, ref: 'Complaint' }],
    isVerifiedByCEE: { type: Boolean, default: false },
    sessions: [{ type: String }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.name = decrypt(ret.name).trim();
        ret.phone = decrypt(ret.phone).trim();
        ret.email = decrypt(ret.email).trim();
        ret.hostel = decrypt(ret.hostel).trim();
        ret.department = decrypt(ret.department).trim();
        ret.designation = decrypt(ret.designation).trim();
      },
    },
  }
);
userSchema.pre<UserDoc>('save', async function (next) {
  this.name = encrypt(this.name.trim());
  this.phone = encrypt(this.phone.trim());
  this.email = encrypt(this.email.trim());
  this.hostel = encrypt(this.hostel.trim());
  this.department = encrypt(this.department.trim());
  this.designation = encrypt(this.designation.trim());
  this.password = this.password.trim();
  next();
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new UserModel(attributes);
};

userSchema.statics.find_one = async (
  who_to_find: {
    email?: string;
    phone?: string;
  },
  select = ''
): Promise<UserDoc | null> => {
  return new Promise((resolve, reject) => {
    const { email, phone } = who_to_find;

    if (!email && !phone) {
      reject(
        new Custom_error({
          errors: [{ message: 'emailOrPhoneRequired' }],
          statusCode: 400,
        })
      );
    }

    if (email && phone) {
      reject(new Error('bothEmailAndPasswordCantBeProvidedSimultaneously'));
    }
    if (email) {
      UserModel.findOne({ email: encrypt(email.trim()) })
        .select(select)
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    }
    if (phone) {
      UserModel.findOne({ phone: encrypt(phone.trim()) })
        .select(select)
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    }
  });
};

const UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { UserModel, UserDoc as permanentUserDoc };
