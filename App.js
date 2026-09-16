import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'chatbot_history';
const LANGUAGE_KEY = 'chatbot_language';

// Mock AI response generator
const getMockAIResponse = (userMessage, language) => {
  const responses = {
    en: [
      "That's an interesting question! Let me think about that.",
      "I understand what you're asking. Here's my perspective on it.",
      "Great point! I'd like to share some thoughts on this.",
      "That's a common question. Here's what I know about it.",
      "I appreciate the question. Let me help you understand this better.",
    ],
    pa: [
      "ਇਹ ਬਹੁਤ ਜਾਣਕਾਰੀ ਵਾਲਾ ਸਵਾਲ ਹੈ! ਮੂਨ੍ਹ ਸੋਚਦਾ ਹਾਂ।",
      "ਮੈ ਸਮਝਦਾ ਹਾਂ ਕਿ ਤੁਸੀ ਕਿਆ ਪੁੱਛ ਰਹੇ ਹੋ। ਇਹ ਮੇਰੀ ਰਾਏ ਹੈ।",
      "ਬਹੁਤ ਵਧੀਆ ਨੁਕਤਾ! ਮੈ ਇਸ ਬਾਰੇ ਆਪਣੇ ਵਿਚਾਰ ਸਾਂਝੇ ਕਰਨਾ ਚਾਹਾਂਦਾ ਹਾਂ।",
      "ਇਹ ਇਕ ਆਮ ਸਵਾਲ ਹੈ। ਮੈ ਇਸ ਬਾਰੇ ਕੀ ਜਾਣਦਾ ਹਾਂ।",
      "ਮੈ ਸਵਾਲ ਦੀ ਸ਼ਲਾਘਾ ਕਰਦਾ ਹਾਂ। ਇਸ ਨੂੰ ਬਿਹਤਰ ਸਮਝਣ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰਦਾ ਹਾਂ।",
    ],
  };

  const langResponses = responses[language] || responses.en;
  const randomIndex = Math.floor(Math.random() * langResponses.length);
  return langResponses[randomIndex];
};

// Language translations
const translations = {
  en: {
    title: 'AI Chatbot',
    inputPlaceholder: 'Ask me anything...',
    sendButton: 'Send',
    newChat: 'New Chat',
    clear: 'Clear',
    copy: 'Copy',
    regenerate: 'Regenerate',
    copied: 'Copied to clipboard!',
    confirmClear: 'Clear all messages?',
    cancel: 'Cancel',
    yes: 'Yes',
    typing: 'AI is typing...',
    language: 'عربى',
  },
  pa: {
    title: 'ਏ.ਆਈ. ਚੈਟਬੋਟ',
    inputPlaceholder: 'ਮੂਨ੍ਹ ਕੁਝ ਵੀ ਪੁੱਛੋ...',
    sendButton: 'ਭੇਜੋ',
    newChat: 'ਨਵੀ ਗੱਲਬਾਤ',
    clear: 'ਸਾਫ਼ ਕਰੋ',
    copy: 'ਕਾਪੀ ਕਰੋ',
    regenerate: 'ਦੁਬਾਰਾ ਬਣਾਓ',
    copied: 'ਕਲਿੱਪਬੋਰਡ ਵਿੱਚ ਕਾਪੀ ਕੀਤਾ!',
    confirmClear: 'ਸਭ ਸੰਦੇਸ਼ ਸਾਫ਼ ਕਰੋ?',
    cancel: 'ਰੱਦ ਕਰੋ',
    yes: 'ਹਾਂ',
    typing: 'ਏ.ਆਈ. ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ...',
    language: 'English',
  },
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const flatListRef = useRef(null);
  const t = translations[language];

  // Load chat history and language on mount
  useEffect(() => {
    loadChatHistory();
    loadLanguage();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved) {
        setLanguage(saved);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveChatHistory(newMessages);
    setInputText('');
    setIsLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(inputText, language),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopyMessage = (text) => {
    // For Expo Snack, we'll use Alert to show the message
    Alert.alert('Message', text, [{ text: 'OK' }]);
  };

  const handleRegenerateResponse = async () => {
    if (messages.length === 0) return;

    // Find the last user message
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) return;

    // Remove the last AI response if it exists
    let messagesToKeep = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesToKeep);
    saveChatHistory(messagesToKeep);
    setIsLoading(true);

    // Generate new response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(messages[lastUserMessageIndex].text, language),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messagesToKeep, aiResponse];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
      setIsLoading(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([]);
    saveChatHistory([]);
    setInputText('');
  };

  const handleClearConversation = () => {
    Alert.alert(
      t.clear,
      t.confirmClear,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.yes,
          onPress: handleNewChat,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleToggleLanguage = () => {
    const newLanguage = language === 'en' ? 'pa' : 'en';
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubbleContainer,
        item.sender === 'user' ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>
      </View>

      {item.sender === 'ai' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => handleCopyMessage(item.text)}
          >
            <Text style={styles.smallButtonText}>{t.copy}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {language === 'en'
          ? 'Start a conversation with the AI!'
          : 'ਏ.ਆਈ. ਨਾਲ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={handleToggleLanguage}
        >
          <Text style={styles.languageButtonText}>{t.language}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={renderEmptyState()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10a37f" />
          <Text style={styles.loadingText}>{t.typing}</Text>
        </View>
      )}

      {/* Action Buttons */}
      {messages.length > 0 && !isLoading && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, styles.regenerateButton]}
            onPress={handleRegenerateResponse}
          >
            <Text style={styles.actionButtonText}>{t.regenerate}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.newChatButton]}
            onPress={handleNewChat}
          >
            <Text style={styles.actionButtonText}>{t.newChat}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClearConversation}
          >
            <Text style={styles.actionButtonText}>{t.clear}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t.inputPlaceholder}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (isLoading || inputText.trim() === '') && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={isLoading || inputText.trim() === ''}
        >
          <Text style={styles.sendButtonText}>{t.sendButton}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#10a37f',
    borderRadius: 8,
  },
  languageButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageBubbleContainer: {
    marginVertical: 8,
    flex: 1,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#10a37f',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#e0e0e0',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 6,
    marginRight: 0,
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  smallButtonText: {
    color: '#10a37f',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#10a37f',
    marginTop: 8,
    fontSize: 14,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenerateButton: {
    backgroundColor: '#444',
  },
  newChatButton: {
    backgroundColor: '#10a37f',
  },
  clearButton: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#10a37f',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
