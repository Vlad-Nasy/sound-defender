"use client";
import "./LiveCall.scss";
import React, { useEffect, useState } from "react";

interface Message {
  from_: string;
  content: string;
}

const App: React.FC = () => {
  const [liveText, setLiveText] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://34.116.142.38/api/conversations/stream");

    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);
        console.log("Received from SERVER ::", data);
        setMessage(data);

        if (data.from_ === "system" && data.content === "NEXTMESSAGE") {
          setLiveText((prevLiveText) => [
            ...prevLiveText,
            { from_: message?.from_ || "", content: message?.content || "" },
          ]);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [message]);

  return (
    <div>
      {/*{liveText.length === 0 ? (*/}
      {/*  <span className="live-call_placeholder">No income call</span>*/}
      {/*) : (*/}
      <div className="live-call_area">
        {liveText.map((msg, index) => (
          <div key={index}>
            <span className="live-call_from">{msg.from_}:</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: msg.content }} />
          </div>
        ))}
        {message && message.from_ !== "system" && (
          <div>
            <span className="live-call_from">{message.from_}:</span>{" "}
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
