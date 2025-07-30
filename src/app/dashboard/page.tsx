"use client"
import Header from '../../components/header';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import CommissionsPage from './CommissionsPage';
import './dashboard.css';
import MessagingPage from './MessagingPage';
import OverviewCard from './OverviewCard';
import RequestCards from './RequestCard';
import RequestType from './RequestType';
import TransactionCard from './TransactionCard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [name, setName] = useState('');
  const [requests, setRequests] = useState<RequestType[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      // Only fetch if user is loaded and has an ID
      if (!user?.id) return;

      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setName(data.name);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Add dashboard-specific body class
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabaseClient
        .from('requests')
        .select(`
          *,
          profile:profiles(name)
        `)
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching requests:', error);
      } else {
        const requests = data.map((request: any) => ({
          id: request.id,
          created_at: request.created_at,
          title: request.title,
          name: request.profile?.name || 'Unknown',
          description: request.description,
          reference_images: request.reference_images,
          email: request.email,
        }));
        setRequests(requests);
      }
    };
    fetchRequests();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'commissions', label: 'Commissions', icon: '🎨' },
    { id: 'transactions', label: 'Transactions', icon: '💰' },
    { id: 'messaging', label: 'Messaging', icon: '💬' },
  ];

  // Default data for components
  const defaultRequests = [
    {
      id: 1,
      created_at: "2024-01-01T00:00:00Z",
      title: "Character Design",
      name: "John Doe",
      description: "John Doe wants a character design for his new project",
      reference_images: ["https://example.com/image1.jpg"],
      email: "john.doe@example.com",
    }
  ];

  const defaultCommissions = [
    {
      id: 1,
      title: "Anime Character Design",
      description: "Mike Chen wants an anime character design for his new project",
      status: "in_progress",
      dueDate: "2025-07-28",
      client: "Mike Chen",
      reference_images: ["https://example.com/image1.jpg"],
      submission_images: ["https://example.com/image1.jpg"],
    }
  ];

  const defaultTransactions = [
    {
      title: "Character Design",
      name: "John Doe",
      amount: 120,
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <OverviewCard commissions={24} money={120} rating={2.8} />
            <RequestCards requests={defaultRequests} />
          </div>
        );
      case 'commissions':
        return (
          <div className="space-y-6">
            <CommissionsPage commissions={defaultCommissions} />
          </div>
        );
      case 'transactions':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Transactions</h3>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-6">
                <div className="text-center py-8">
                  <TransactionCard transactions={defaultTransactions} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'messaging':
        return (
          <div className="space-y-6">
            <MessagingPage />
          </div>
        );
      default:
        return null;
    }
  };

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

