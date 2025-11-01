import './App.css'
import { useState } from 'react';
import { createParser, type EventSourceMessage } from 'eventsource-parser'

function App() {

  const [messages, setMessages] = useState<string>("");

  const onMessage = (message: EventSourceMessage) => {
    try {
      const res = JSON.parse(message.data);
      console.log("res", res)
      const { choices } = res;
      if (!choices || choices.length === 0) {
        return;
      }
      const { finish_reason: finishReason } = choices[0];
      if (finishReason) {
        console.log("finish_reason: ", finishReason)
        return;
      }

      const { content = "" } = choices[0].delta;
      console.log("content", content)
      setMessages((prev) => prev + content);
    } catch (err) {
      if (message.data.trim() !== "[DONE]") {
        console.error("err", err)
      }
    }
  }

  const parser = createParser({
    onEvent: (event: EventSourceMessage) => {
      console.log("event", event)
      onMessage(event)
    }
  })

  const API_KEY = import.meta.env.VITE_API_KEY

  function fetchStream() {
    const url = "https://aihubmix.com/v1/chat/completions";

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
             "role": "user",
             "content": "你好，很高兴见到你"
          }
        ],
        stream: true
      }),
    })
      .then(async response => {
        console.log(response);
        const reader = response?.body?.getReader();

        if (!reader) {
          throw new Error('No reader available');
        }

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const data = new TextDecoder().decode(value);
          parser.feed(data)
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <>
      <h1>AI 开发实战</h1>
      <button id="start-button" onClick={fetchStream}>请求 openai-4.1-mini</button>
      <p className="content">
        {messages}
      </p>
    </>
  )
}

export default App
