'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ChatConversation {
  id: string;
  phoneNumber: string;
  userName: string;
  createdAt: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Obtener conversaciones
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${API_BASE}/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setConversations(response.data || []);
    } catch (err) {
      setError('Error cargando conversaciones');
      console.error(err);
    }
  };

  // Obtener mensajes de una conversación
  const fetchMessages = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/chat/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(response.data || []);
    } catch (err) {
      setError('Error cargando mensajes');
      console.error(err);
    }
  };

  // Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConversation || !newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Agregar mensaje del bot
      const response = await axios.post(
        `${API_BASE}/chat/message`,
        {
          phoneNumber: selectedConversation.phoneNumber,
          userName: selectedConversation.userName,
          message: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setNewMessage('');
      
      // Recargar mensajes
      if (selectedConversation.id) {
        await fetchMessages(selectedConversation.id);
      }
    } catch (err) {
      setError('Error enviando mensaje');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar conversación
  const handleSelectConversation = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.id);
  };

  // Auto-scroll al final de mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cargar conversaciones al montar
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Recargar cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Chatbot WhatsApp</h1>
          <p className="text-slate-600">Gestiona conversaciones con clientes</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversaciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Conversaciones</h2>
              
              {conversations.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No hay conversaciones</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedConversation?.id === conv.id
                          ? 'bg-teal-100 border-2 border-teal-500'
                          : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{conv.userName}</div>
                      <div className="text-sm text-slate-600">{conv.phoneNumber}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(conv.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mensajes */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-xl text-white">
                  <h3 className="text-xl font-bold">{selectedConversation.userName}</h3>
                  <p className="text-teal-100">{selectedConversation.phoneNumber}</p>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  {messages.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No hay mensajes</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-teal-500 text-white rounded-br-none'
                              : 'bg-slate-200 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'user' ? 'text-teal-100' : 'text-slate-600'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="border-t p-4 bg-white rounded-b-xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-500 text-lg">Selecciona una conversación para empezar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
