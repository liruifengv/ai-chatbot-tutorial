import { useChat } from 'ai/react';

const Chat = () => {
  const sendMessage = async () => {
    console.log("Sending message");
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Hello, world!' })
    }).then(res => res.json());
    console.log("Response", res);
  };

  return (
    <div>
      <button type="button" onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;