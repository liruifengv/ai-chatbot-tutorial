import './App.css'
import { useState } from 'react';
import { type EventSourceMessage } from 'eventsource-parser'
import { streamRequest } from './utils/streamRequest'

// 消息类型定义
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_KEY = import.meta.env.VITE_API_KEY

  function sendMessage(userInput: string) {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: userInput.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    const messagesToSend = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    let assistantMessage = "";
    streamRequest({
      url: "https://aihubmix.com/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: "gpt-4.1-mini",
        messages: messagesToSend,
        stream: true
      },
      onMessage: (message: EventSourceMessage) => {
        try {
          const res = JSON.parse(message.data);
          const { choices } = res;
          if (!choices || choices.length === 0) {
            return;
          }
          const { finish_reason: finishReason } = choices[0];
          if (finishReason) {
            setIsLoading(false);
            return;
          }
    
          const { content = "" } = choices[0].delta;
          assistantMessage += content;
          setMessages([
            ...updatedMessages,
            {
              role: 'assistant',
              content: assistantMessage
            }
          ]);
        } catch (err) {
          if (message.data.trim() !== "[DONE]") {
            console.error("AI 请求错误:", err)
          }
        }
      },
      onError: (error) => {
        console.error('AI 请求失败:', error);
        setIsLoading(false);
      },
      onComplete: () => {
        console.log('AI 请求完成');
        setIsLoading(false);
      }
    });
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI 助手</h1>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              <span className="message-prefix">
                {message.role === 'user' ? '用户: ' : 'AI: '}
              </span>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          autoFocus
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的消息..."
          disabled={isLoading}
          className="input-field"
        />
        <button 
          onClick={() => sendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="send-button"
        >
          发送
        </button>
      </div>
    </div>
  )
}

export default App
