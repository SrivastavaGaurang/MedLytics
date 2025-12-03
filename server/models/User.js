// models/User.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    // models/User.js
    import mongoose from 'mongoose';
    const { Schema } = mongoose;

    const UserSchema = new Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values to not conflict
      },
      password: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      authId: {
        type: String,
        required: false, // Made optional since we're moving away from Auth0
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      isPhoneVerified: {
        type: Boolean,
        default: false,
      },
      resetPasswordToken: String,
      resetPasswordExpires: Date,
      lastLogin: Date,
    });

    export default mongoose.model('User', UserSchema);