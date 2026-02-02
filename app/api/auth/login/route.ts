import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return Response.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Try to find user by email OR username (since email field exists but isn't unique)
        // First try exact email match, then try as username
        let user = await prisma.user.findFirst({
            where: { email: email }
        });

        // If not found by email, try username (in case user entered username instead)
        if (!user) {
            user = await prisma.user.findUnique({
                where: { username: email }
            });
        }

        if (!user) {
            return Response.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return Response.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.session.create({
            data: {
                id: `session_${Date.now()}_${user.id}`,
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // Return user data and token
        return Response.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                section: user.section
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return Response.json(
            { success: false, message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
