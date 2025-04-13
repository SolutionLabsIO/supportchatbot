import { writable } from 'svelte/store';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isIncoming: boolean;
}

export interface Conversation {
  id: string;
  senderId: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt: Date;
}

// Initialize with local storage if available
const storedConversations = typeof localStorage !== 'undefined' 
  ? JSON.parse(localStorage.getItem('conversations') || '[]')
  : [];

// Process stored data to ensure dates are Date objects
const processedConversations = storedConversations.map((conv: any) => ({
  ...conv,
  startedAt: new Date(conv.startedAt),
  lastMessageAt: new Date(conv.lastMessageAt),
  messages: conv.messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }))
}));

export const conversations = writable<Conversation[]>(processedConversations);

// Subscribe to changes and save to localStorage
if (typeof localStorage !== 'undefined') {
  conversations.subscribe(value => {
    localStorage.setItem('conversations', JSON.stringify(value));
  });
}

export function addMessage(senderId: string, text: string, isIncoming: boolean) {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date();
  
  conversations.update(convs => {
    // Find existing conversation for this sender
    let conversation = convs.find(c => c.senderId === senderId);
    
    if (!conversation) {
      // Create new conversation if none exists
      conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        senderId,
        messages: [],
        startedAt: now,
        lastMessageAt: now
      };
      convs = [conversation, ...convs];
    }
    
    // Add message to conversation
    const message: Message = {
      id: messageId,
      senderId,
      text,
      timestamp: now,
      isIncoming
    };
    
    conversation.messages = [...conversation.messages, message];
    conversation.lastMessageAt = now;
    
    return convs;
  });
  
  return messageId;
}

export function clearConversations() {
  conversations.set([]);
} 