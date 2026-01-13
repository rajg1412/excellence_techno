import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId;
    bio: string;
    title: string;
    skills: string[];
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        bio: { type: String, default: '' },
        title: { type: String, default: '' },
        skills: { type: [String], default: [] },
        location: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
