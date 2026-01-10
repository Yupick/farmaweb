import * as chatService from '../services/chatService.js';

export async function sendMessage(req, res) {
  try {
    const { phoneNumber, userName, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Teléfono y mensaje requeridos' });
    }

    // Buscar o crear conversación
    let conversation = await chatService.searchChatConversations(phoneNumber);
    
    if (!conversation) {
      const conversationId = await chatService.createChatConversation(phoneNumber, userName);
      conversation = { id: conversationId };
    }

    // Guardar mensaje del usuario
    await chatService.addChatMessage(conversation.id, 'user', message, 'text');

    // Obtener respuesta de IA
    const aiResponse = await chatService.getAIResponseFromLLM(message, conversation.id);

    // Guardar respuesta del bot
    await chatService.addChatMessage(conversation.id, 'bot', aiResponse.response, 'bot_response');

    res.json({
      conversationId: conversation.id,
      userMessage: message,
      botResponse: aiResponse.response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getConversations(req, res) {
  try {
    const conversations = await chatService.getChatConversations();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getConversationById(req, res) {
  try {
    const { id } = req.params;
    const conversation = await chatService.getChatConversationById(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    const messages = await chatService.getChatMessages(id);
    
    res.json({
      ...conversation,
      messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const messages = await chatService.getChatMessages(conversationId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
