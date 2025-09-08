"use client"
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  otherUserId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  pfp_url?: string;
  user_name?: string;
}

export default function Messaging() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Helper to ensure we don't render duplicate message ids
  const dedupeMessagesById = (msgs: Message[]) => {
    const seen = new Set<string>();
    return msgs.filter((m) => {
      const key = String(m.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id) return;

    const { data, error } = await supabaseClient.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedConversation,
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      // Refresh messages
      fetchMessages(selectedConversation);
      fetchConversations();
    }
  }

  // Only set up channel if user is authenticated
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscription for user:', user.id);

    const channel = supabaseClient
      .channel('messages')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload)
          // Check if this message involves the current user
          if (payload.new.sender_id === user.id || payload.new.receiver_id === user.id) {
            // Add new message to state if it's from the current conversation
            if (selectedConversation && payload.new.sender_id === selectedConversation) {
              setMessages(prev => {
                const incoming = payload.new as Message;
                const alreadyExists = prev.some(m => String(m.id) === String(incoming.id));
                if (alreadyExists) return prev;
                return [...prev, incoming];
              });
            }
            // Refresh conversations to update last message
            fetchConversations();
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabaseClient.removeChannel(channel);
    };
  }, [user?.id, selectedConversation]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user?.id) return;

    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    // Group messages by conversation and create conversation objects
    const conversationMap = new Map<string, Conversation>();

    data?.forEach((message) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          id: otherUserId,
          otherUserId,
          //TODO: get the last message from the conversation
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unreadCount: 0 // You can implement unread count logic later
        });
      }
    });

    // Fetch profile data for each conversation
    const conversationsWithProfiles = await Promise.all(
      Array.from(conversationMap.values()).map(async (conversation) => {
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('pfp_url, user_name')
          .eq('id', conversation.otherUserId)
          .single();

        if (profileError) {
          console.error('Error fetching profile for user:', conversation.otherUserId, profileError);
          return conversation;
        }

        return {
          ...conversation,
          pfp_url: profileData?.pfp_url,
          user_name: profileData?.user_name
        };
      })
    );

    setConversations(conversationsWithProfiles);
  }

  // Fetch messages for a specific conversation
  const fetchMessages = async (otherUserId: string) => {
    if (!user?.id) return;

    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(dedupeMessagesById((data || []) as Message[]));
    }
  }

  // Handle conversation selection
  const selectConversation = async (otherUserId: string) => {
    setSelectedConversation(otherUserId);
    await fetchMessages(otherUserId);

    // Get other user's profile info
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('pfp_url, user_name')
      .eq('id', otherUserId)
      .single();

    if (profileError) {
      console.error('Error fetching profile for user:', otherUserId, profileError);
      setOtherUser({ id: otherUserId, user_name: `User ${otherUserId.slice(0, 8)}` });
    } else {
      setOtherUser({
        id: otherUserId,
        user_name: profileData?.user_name || `User ${otherUserId.slice(0, 8)}`,
        pfp_url: profileData?.pfp_url
      });
    }
  }

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations when user is authenticated
  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="rounded-lg shadow h-screen flex pt-14 pb-14 sm:pb-0">
      <Header />
      {/* Conversations List */}
      <div className="w-1/3 border-r border-custom-gray flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-white">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation.otherUserId)}
                className={`p-4 cursor-pointer border-b border-custom-gray hover:bg-custom-gray transition-colors ${selectedConversation === conversation.otherUserId ? 'bg-custom-gray' : ''
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-custom-darkgray rounded-full flex items-center justify-center overflow-hidden">
                    {conversation.pfp_url ? (
                      <img
                        src={conversation.pfp_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {conversation.otherUserId.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white truncate">
                        {conversation.user_name || `User ${conversation.otherUserId.slice(0, 8)}`}
                      </h4>
                      <span className="text-xs text-white">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="flex items-center justify-between mt-1">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-custom-gray flex items-center space-x-3 flex-shrink-0">
              <div className="w-8 h-8 bg-custom-darkgray rounded-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => router.push(`/profile/${otherUser?.user_name}`)}>
                {otherUser?.pfp_url ? (
                  <img
                    src={otherUser.pfp_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-white">
                    {otherUser?.id?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white cursor-pointer" onClick={() => router.push(`/profile/${otherUser?.user_name}`)}>
                  {otherUser?.user_name || `User ${selectedConversation.slice(0, 8)}`}
                </h4>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center text-white mt-8">
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender_id === user?.id
                        ? 'bg-custom-blue text-white'
                        : 'bg-custom-gray text-white'
                        }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-custom-gray flex-shrink-0">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                onSubmit={sendMessage}
                placeholder="message"
                className="w-full px-3 py-2 bg-custom-gray rounded-md focus:outline-none focus:bg-white/10"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-white">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}