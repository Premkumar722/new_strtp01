'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Phone, Video, Info } from 'lucide-react';
import { mockChatMessages } from '@/utils/mock-data';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(mockChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [selectedContact, setSelectedContact] = useState('John Doe');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        sender: 'You',
        text: inputValue,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate response after a delay
      setTimeout(() => {
        const responses = [
          'Thanks for your interest!',
          'Yes, that sounds great!',
          'When would you like to meet?',
          'I can arrange a video call!',
          'Let me check and get back to you.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const replyMessage: Message = {
          id: String(messages.length + 2),
          sender: selectedContact,
          text: randomResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1000);
    }
  };

  const contacts = [
    { name: 'John Doe', lastMessage: 'When can you visit?', lastTime: '2:30 PM', unread: 0 },
    { name: 'Sarah Smith', lastMessage: 'Interested in your cat', lastTime: '1:15 PM', unread: 2 },
    { name: 'Mike Johnson', lastMessage: 'Can you provide more details?', lastTime: 'Yesterday', unread: 1 },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Contacts List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <Input type="text" placeholder="Search conversations..." />
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.name}
              onClick={() => setSelectedContact(contact.name)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedContact === contact.name
                  ? 'bg-purple-50 border-l-4 border-l-purple-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                    {contact.unread}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">{contact.lastTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{selectedContact}</h3>
            <p className="text-sm text-gray-600">Online</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'You'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'You' ? 'text-purple-100' : 'text-gray-600'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
