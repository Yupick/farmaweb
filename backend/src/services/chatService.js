import { getDatabase } from '../config/database.js';
import { getAIResponse } from './llmService.js';

export async function createChatConversation(phoneNumber, userName = null) {
  const db = await getDatabase();
  
  const result = await db.run(
    `INSERT INTO chat_conversations (phone_number, user_name, status)
     VALUES (?, ?, 'active')`,
    [phoneNumber, userName]
  );

  return result.lastID;
}

export async function getChatConversations(limit = 50) {
  const db = await getDatabase();
  
  const conversations = await db.all(
    `SELECT * FROM chat_conversations ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );

  return conversations;
}

export async function getChatConversationById(conversationId) {
  const db = await getDatabase();
  
  const conversation = await db.get(
    `SELECT * FROM chat_conversations WHERE id = ?`,
    [conversationId]
  );

  return conversation;
}

export async function addChatMessage(conversationId, sender, content, messageType = 'text') {
  const db = await getDatabase();
  
  const result = await db.run(
    `INSERT INTO chat_messages (conversation_id, sender, content, type)
     VALUES (?, ?, ?, ?)`,
    [conversationId, sender, content, messageType]
  );

  return result.lastID;
}

export async function getChatMessages(conversationId, limit = 100) {
  const db = await getDatabase();
  
  const messages = await db.all(
    `SELECT * FROM chat_messages 
     WHERE conversation_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [conversationId, limit]
  );

  return messages.reverse();
}

export async function getAIResponseFromLLM(userMessage, conversationId) {
  try {
    const response = await getAIResponse(userMessage, '', 'whatsapp');
    
    return {
      id: Date.now(),
      response: response,
      type: 'bot_response'
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      id: Date.now(),
      response: "Gracias por tu consulta. Un operador revisará tu mensaje pronto.",
      type: 'bot_response'
    };
  }
}

export async function searchChatConversations(phoneNumber) {
  const db = await getDatabase();
  
  const conversation = await db.get(
    `SELECT * FROM chat_conversations WHERE phone_number = ?`,
    [phoneNumber]
  );

  return conversation;
}
