import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Profile from '@/models/Profile';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET profile
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user: any = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const profile = await Profile.findOne({ userId: user.id });

        // Fetch latest user data to ensure roles are sync'd
        const latestUser = await User.findById(user.id).select('-password');

        return NextResponse.json({
            profile: profile || null,
            user: latestUser
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST/PUT profile (create or update)
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user: any = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const profile = await Profile.findOneAndUpdate(
            { userId: user.id },
            { ...data, userId: user.id },
            { new: true, upsert: true }
        );

        return NextResponse.json(profile);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
// DELETE profile
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const user: any = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await Profile.findOneAndDelete({ userId: user.id });
        return NextResponse.json({ message: 'Profile deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
