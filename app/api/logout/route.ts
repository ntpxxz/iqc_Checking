import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    // รายชื่อคุกกี้ที่ NextAuth มักจะใช้
    const nextAuthCookies = [
        'next-auth.session-token',
        'next-auth.callback-url',
        'next-auth.csrf-token',
        '__Secure-next-auth.session-token',
        '__Host-next-auth.csrf-token'
    ];

    // ลบคุกกี้ทั้งหมดที่เกี่ยวข้อง
    nextAuthCookies.forEach(cookieName => {
        cookieStore.delete(cookieName);
    });

    return NextResponse.json({
        success: true,
        message: 'Logged out and session cookies cleared'
    });
}

// รองรับ GET ด้วยเพื่อให้เรียกผ่าน URL ได้ง่ายในกรณีฉุกเฉิน
export async function GET() {
    return POST();
}
