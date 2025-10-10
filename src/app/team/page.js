'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FocusLock from 'react-focus-lock';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_TEAM_SERVICE_URL || 'http://localhost:5000/api/teams';

export default function InvitesPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token && isAuthenticated) handleInviteAction(token);
  }, [isAuthenticated, searchParams]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated)
      router.replace('/login?redirect=/invites');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) fetchInvitations();
  }, [isAuthenticated]);

  // Fetch invitations
  const fetchInvitations = async () => {
    setIsLoadingInvites(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/my-invitations`, {
        withCredentials: true,
      });
      setInvitations(res.data.invitations || []);
    } catch (err) {
      toast.error('Failed to fetch invitations.');
    } finally {
      setIsLoadingInvites(false);
    }
  };

  // Accept invite
  const handleInviteAction = async (token) => {
    try {
      await axios.post(
        `${API_BASE_URL}/accept-invite`,
        { token },
        { withCredentials: true }
      );
      toast.success('Invitation accepted!');
      fetchInvitations();
      router.replace('/invites');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept invitation.');
    }
  };

  // Send invite
  const sendInvite = async () => {
    if (!email) return toast.error('Enter email address.');
    setIsSending(true);
    try {
      await axios.post(
        `${API_BASE_URL}/send-invite`,
        { invited_email: email, role },
        { withCredentials: true }
      );
      toast.success('Invite sent!');
      setEmail('');
      setRole('member');
      setIsDialogOpen(false);
      fetchInvitations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || isLoadingInvites) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs text-gray-600">
        <div className="h-8 w-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Logic for Members & Pending
  let filteredInvitations = [];

  if (activeTab === 'members') {
    const acceptedInvites = invitations.filter((inv) => inv.status === 'accepted');
    const members = acceptedInvites.filter((inv) => inv.email !== user.email);
    filteredInvitations = [
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'admin',
      },
      ...members,
    ];
  } else {
    filteredInvitations = invitations.filter((inv) => inv.status !== 'accepted');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-xs">
      <Toaster position="bottom-right" toastOptions={{ className: 'text-xs' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-[14px] font-semibold text-gray-800">Team Invitations</h1>
          <p className="mt-2 text-xs text-gray-600 max-w-2xl">
            Manage your team by inviting new members or viewing pending invitations. Add collaborators to Complete Task.
          </p>
        </header>

        {/* Send Invite Button */}
        <div className="mb-8">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="px-6 py-2 bg-[#00BFFF] text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs w-full sm:w-auto disabled:bg-[#00BFFF]/50 disabled:cursor-not-allowed"
            aria-label="Send new team invitation"
            disabled={isSending}
          >
            Send New Invite
          </Button>
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white border border-gray-200 rounded-md shadow-lg p-6 max-w-md">
            <FocusLock>
              <DialogHeader>
                <DialogTitle className="text-[14px] font-semibold text-gray-800">
                  Send Invitation
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-600">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white"
                    aria-label="Email address for invitation"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-xs font-medium text-gray-600">
                    Role
                  </label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value)}
                  >
                    <SelectTrigger
                      id="role"
                      className="w-full px-4 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member" className="text-xs">Member</SelectItem>
                      <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs font-medium w-full sm:w-auto disabled:bg-gray-200/50 disabled:cursor-not-allowed"
                    aria-label="Cancel invitation"
                    disabled={isSending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={sendInvite}
                    className="px-4 py-2 bg-[#00BFFF] text-white rounded-md hover:bg-[#00BFFF]/80 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs font-medium w-full sm:w-auto disabled:bg-[#00BFFF]/50 disabled:cursor-not-allowed"
                    aria-label="Send invitation"
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Invite'}
                  </Button>
                </DialogFooter>
              </div>
            </FocusLock>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex border-b border-gray-200 bg-white rounded-md">
              <TabsTrigger
                value="members"
                className={`px-4 py-2 text-xs font-medium ${
                  activeTab === 'members'
                    ? 'text-[#00BFFF] border-b-2 border-[#00BFFF]'
                    : 'text-gray-600 hover:text-[#00BFFF]'
                }`}
                aria-controls="members-panel"
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className={`px-4 py-2 text-xs font-medium ${
                  activeTab === 'pending'
                    ? 'text-[#00BFFF] border-b-2 border-[#00BFFF]'
                    : 'text-gray-600 hover:text-[#00BFFF]'
                }`}
                aria-controls="pending-panel"
              >
                Pending Invitations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members" id="members-panel">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvitations.length > 0 ? (
                      filteredInvitations.map((inv, index) => (
                        <tr key={inv.id || index}>
                          <td className="px-4 py-4 text-xs text-gray-600">{inv.name || 'N/A'}</td>
                          <td className="px-4 py-4 text-xs text-gray-600">{inv.email}</td>
                          <td className="px-4 py-4 text-xs text-gray-600 capitalize">{inv.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-xs text-gray-600">
                          No members yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="pending" id="pending-panel">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvitations.length > 0 ? (
                      filteredInvitations.map((inv, index) => (
                        <tr key={inv.id || index}>
                          <td className="px-4 py-4 text-xs text-gray-600">{inv.name || 'N/A'}</td>
                          <td className="px-4 py-4 text-xs text-gray-600">{inv.email}</td>
                          <td className="px-4 py-4 text-xs text-gray-600 capitalize">{inv.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-xs text-gray-600">
                          No pending invitations yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {activeTab === 'pending' && (
          <p className="mt-4 text-xs text-gray-600">
            Invitations are valid for 14 days. Contact support if you need assistance with expired or pending invitations.
          </p>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';