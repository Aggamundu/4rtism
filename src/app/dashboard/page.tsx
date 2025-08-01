"use client"
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import CommissionsPage from './CommissionsPage';
import CommissionType from './CommissionType';
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
  const [orders, setOrders] = useState<CommissionType[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      // Only fetch if user is loaded and has an ID
      if (!user?.id) {
        console.log('No user ID');
        return;
      }

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

  const fetchRequests = async () => {
    // Only fetch if user is loaded and has an ID
    if (!user?.id) {
      console.log('No user ID');
      return;
    }

    console.log('Fetching requests for user:', user.id);
    const { data, error } = await supabaseClient
      .from('requests')
      .select(`
        *
      `)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      console.log('Raw data from database:', data);
      console.log('Number of requests found:', data?.length || 0);
      const requests = data.map((request: any) => ({
        id: request.id,
        created_at: request.created_at,
        title: request.title,
        name: request.name,
        description: request.description,
        reference_images: request.reference_images,
        email: request.email,
        user_id: request.user_id,
        client_id: request.client_id,
      }));
      setRequests(requests);
    }
  };

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID');
      return;
    }
    const { data, error } = await supabaseClient
      .from('orders')
      .select(`*`)
      .or(`user_id.eq.${user.id},client_id.eq.${user.id}`);

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      console.log('Orders query result:', data);
      console.log('User ID:', user.id);
      console.log('User ID type:', typeof user.id);

      // Log each order to see the actual data structure
      data?.forEach((order, index) => {
        console.log(`Order ${index}:`, {
          id: order.id,
          user_id: order.user_id,
          client_id: order.client_id,
          user_id_type: typeof order.user_id,
          client_id_type: typeof order.client_id
        });
      });
      const orders = data?.map((order: any) => ({
        id: order.id,
        title: order.title,
        description: order.description,
        status: order.status,
        dueDate: order.dueDate,
        client: order.client,
        reference_images: order.reference_images,
        submission_images: order.submission_images,
        user_id: order.user_id,
        client_id: order.client_id,
        client_name: order.name,
        email: order.email,
        price: order.price,
        created_at: order.created_at,
        artist_name: order.artist_name,
        delivery_days: order.delivery_days,
      }));
      setOrders(orders);
      console.log('Raw data from database:', data);
      console.log('Number of orders found:', data?.length || 0);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchOrders();
  }, [user?.id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'commissions', label: 'Commissions', icon: '🎨' },
    { id: 'transactions', label: 'Transactions', icon: '💰' },
    { id: 'messaging', label: 'Messaging', icon: '💬' },
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
            <RequestCards
              requests={requests}
              onRefresh={() => {
                // Re-fetch requests
                if (user?.id) {
                  fetchRequests();
                }
              }}
              name={name}
              onOpenMessage={async (userId: string) => {
                // Switch to messaging tab
                setActiveTab('messaging');

                // Check if conversation already exists
                if (user?.id) {
                  const { data: existingMessages, error } = await supabaseClient
                    .from('messages')
                    .select('*')
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
                    .limit(1);

                  if (error) {
                    console.error('Error checking existing messages:', error);
                    return;
                  }

                  // If no messages exist, send "hi" message
                  if (!existingMessages || existingMessages.length === 0) {
                    const { error: sendError } = await supabaseClient
                      .from('messages')
                      .insert({
                        sender_id: user.id,
                        receiver_id: userId,
                        content: 'hi',
                        created_at: new Date().toISOString()
                      });

                    if (sendError) {
                      console.error('Error sending initial message:', sendError);
                    } else {
                      console.log('Initial "hi" message sent to user:', userId);
                    }
                  } else {
                    console.log('Conversation already exists with user:', userId);
                  }
                }
              }}
            />
          </div>
        );
      case 'commissions':
        return (
          <div className="space-y-6">
            <CommissionsPage commissions={orders} onRefresh={() => {
              if (user?.id) {
                fetchOrders();
              }
            }} authId={user?.id} />
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

