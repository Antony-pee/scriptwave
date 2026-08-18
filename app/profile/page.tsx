'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function ProfileSettings() {
    const [profile, setProfile] = useState<any>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setPhone(data.phone || '');
            }
        }
        setLoading(false);
    }

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault();
        setMessage('');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                phone: phone
            })
            .eq('id', user.id);

        if (error) {
            setMessage('Error updating profile: ' + error.message);
        } else {
            setMessage('Profile updated successfully!');
            fetchProfile();
        }
    }

    if (loading) {
        return <div className="p-8 text-white">Loading profile...</div>;
    }

    return (
        <div className="p-8 max-w-xl mx-auto text-white">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={updateProfile} className="bg-gray-900 border border-gray-800 p-6 rounded-lg space-y-4 shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                        type="text"
                        disabled
                        value={profile?.email || ''}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-400 p-2 rounded cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 text-white p-2 rounded focus:outline-none focus:border-indigo-500"
                        placeholder="Enter your first name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Surname</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 text-white p-2 rounded focus:outline-none focus:border-indigo-500"
                        placeholder="Enter your surname"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Cell Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 text-white p-2 rounded focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. 0821234567"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Account Created</label>
                    <input
                        type="text"
                        disabled
                        value={profile?.created_at ? new Date(profile.created_at).toLocaleString() : ''}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-400 p-2 rounded cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}