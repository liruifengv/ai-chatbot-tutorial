import './App.css'
import { useState } from 'react';
import { createParser, type EventSourceMessage } from 'eventsource-parser'

function App() {

  const [messages, setMessages] = useState<string>("");

  function onEvent(event: EventSourceMessage) {
    console.log('Received event!')
    console.log('id: %s', event.id || '<none>')
    console.log('event: %s', event.event || '<none>')
    console.log('data: %s', event.data)
    // if (!event.event) {
    setMessages((prev) => prev + event.data);
    // }
  }

  const parser = createParser({ onEvent })

  function fetchStream() {

    const url = "http://localhost:3000/events";

    fetch(url)
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
          console.log(value);
          const data = new TextDecoder().decode(value);
          console.log(data);
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
      <button id="start-button" onClick={fetchStream}>start</button>
      <p className="content">
        {messages}
      </p>
    </>
  )
}

export default App
