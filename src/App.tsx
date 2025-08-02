import './App.css'
import { useState } from 'react';

function App() {

  const [messages, setMessages] = useState<string>("");

  function parseData(data: string) {
    // 解析数据 data: 开头，换行符结尾
    if (data.startsWith("data:")) {
      return {
        data: data.replace("data:", "").trim()
      }
    }
    if (data.startsWith("event:")) {
      return {
        event: data.replace("event:", "").trim()
      }
    }
    return {
      data: ""
    }
  }

  function fetchStream() {

    const url = "http://localhost:3000/events";

    fetch(url)
      .then(async response => {
        console.log(response);
        const reader = response?.body?.getReader();

        if (!reader) {
          throw new Error('No reader available');
        }

        let msg = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          console.log(value);
          const data = new TextDecoder().decode(value);
          console.log(data);
          const parsedData = parseData(data);
          console.log(parsedData);
          msg += parsedData?.data ?? "";
          setMessages(msg);
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <>
      <h1>AI 开发实战</h1>
      <button id="start-button" onClick={fetchStream}>start</button>
      <p className="content">
        {messages}
      </p>
    </>
  )
}

export default App
