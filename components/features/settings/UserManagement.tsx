'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, Loader2, Check, X } from 'lucide-react';
import { User } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'inspector' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (res.ok) {
                await fetchUsers();
                setNewUser({ name: '', email: '', password: '', role: 'inspector' });
                setShowAddForm(false);
            }
        } catch (error) {
            console.error('Failed to add user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="ms-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-[#323130]">User Management</h3>
                    <p className="text-sm text-[#605E5C]">Manage system users and their access levels</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="ms-button ms-button-primary h-9 px-4 rounded-lg"
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {showAddForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleAddUser} className="bg-[#FAF9F8] p-4 rounded-xl border border-[#EDEBE9] mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Username</label>
                                <input
                                    required
                                    type="text"
                                    className="ms-input w-full"
                                    placeholder="e.g. john_doe"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="ms-input w-full"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Email (Optional)</label>
                                <input
                                    type="email"
                                    className="ms-input w-full"
                                    placeholder="john@example.com"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Role</label>
                                <div className="flex gap-2">
                                    <select
                                        className="ms-input w-full"
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="inspector">Inspector</option>
                                        <option value="admin">Administrator</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="ms-button ms-button-primary h-10 px-4 rounded-lg shrink-0"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="overflow-hidden border border-[#EDEBE9] rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAF9F8]">
                        <tr>
                            <th className="px-4 py-3 text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Joined</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-[#605E5C] uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDEBE9]">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ffe500]" />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#605E5C]">
                                    No users found.
                                </td>
                            </tr>
                        ) : users.map(user => (
                            <tr key={user.id} className="hover:bg-[#FAF9F8] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#F3F2F1] rounded-lg flex items-center justify-center text-xs font-bold text-[#323130]">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#323130]">{user.name}</p>
                                            <p className="text-[10px] text-[#605E5C]">{user.email || 'No email'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-[#DEECF9] text-[#0078D4]' : 'bg-[#DFF6DD] text-[#107C41]'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-[#605E5C]">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="p-2 text-[#A4262C] hover:bg-[#FDE7E9] rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
