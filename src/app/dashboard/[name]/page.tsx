"use client"
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import './dashboard.css';
import OverviewCard from './OverviewCard';
import RequestCards from './RequestCard';
import CommissionsPage from './CommissionsPage';
import TransactionCard from './TransactionCard';

export default function DashboardPage({ params }: { params: Promise<{ name: string }> }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [name, setName] = useState('');

  // Add dashboard-specific body class
  useEffect(() => {
    document.body.classList.add('dashboard-page');

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  // Await params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setName(resolvedParams.name);
    };
    getParams();
  }, [params]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'commissions', label: 'Commissions', icon: '🎨' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
  ];
  const requests = [
    {
      id: 1,
      created_at: "2021-01-01",
      title: "Character design",
      name: "John Doe",
      description: "John Doe wants a character design for his new project",
      reference_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      email: "john.doe@example.com",
    },
    {
      id: 2,
      created_at: "2021-01-02",
      title: "Logo design",
      name: "Sarah Wilson",
      description: "Sarah Wilson wants a logo design for her new business",
      reference_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      email: "sarah.wilson@example.com",
    },
    {
      id: 3,
      created_at: "2021-01-02",
      title: "Logo design",
      name: "Sarah Wilson",
      description: "Sarah Wilson wants a logo design for her new business",
      reference_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      email: "sarah.wilson@example.com",
    }
  ]
  const commissions = [
    {
      id: 1,
      title: "Anime Character Design",
      description: "Mike Chen wants an anime character design for his new project",
      status: "in_progress",   
      dueDate: "2025-07-28",
      client: "Mike Chen",
      reference_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      submission_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    },
    {
      id: 2,
      title: "Logo Design",   
      description: "Sarah Wilson wants a logo design for her new business",
      status: "Awaiting Approval",
      dueDate: "2025-08-01",
      client: "Sarah Wilson",
      reference_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      submission_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    },
    {
      id: 3,
      title: "Logo Design",   
      description: "Sarah Wilson wants a logo design for her new business",
      status: "Awaiting Payment",
      dueDate: "2025-08-01",
      client: "Sarah Wilson",
      reference_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      submission_images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    },
  ]

  const transactions = [
    {
      title: "Character Design",
      name: "John Doe",
      amount: 120,
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <OverviewCard commissions={24} money={120} rating={2.8} />
            <RequestCards requests={requests} />
          </div>
        );
      case 'commissions':
        return (
          <div className="space-y-6">
            <CommissionsPage commissions={commissions} />
          </div>
        );
      case 'earnings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Earnings Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">This Month</h4>
                  <p className="text-2xl font-bold text-green-600">$1,240</p>
                  <p className="text-sm text-gray-500">+8% from last month</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">This Year</h4>
                  <p className="text-2xl font-bold text-blue-600">$8,450</p>
                  <p className="text-sm text-gray-500">+15% from last year</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Transactions</h3>
              <div className="space-y-3">
                <TransactionCard transactions={transactions} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {name}!</p>
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

