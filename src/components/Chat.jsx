import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

function Chat({ prompt, mode }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const [response, setResponse] = useState("");

  useEffect(() => {
    if (mode === "chat" && prompt) {
      handleSubmit(prompt);
    }
  }, [mode, prompt]);

  async function handleSubmit(input) {
    setResponse("");
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: input,
      config: {
        systemInstruction:
          "You are an informative and helpful assistant on a smart frontend React developer's personal dashboard. Your job is to answer random questions correctly and concisely in at most 5 sentences. Do this unless told otherwise.",
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    for await (const chunk of response) {
      setResponse((prev) => prev + chunk.text);
    }
  }

  return (
    <div className="widget">
      {prompt && response ? (
        <>
          <div className="chat-prompt">{prompt}</div>
          <div className="chat-response">{response}</div>
        </>
      ) : (
        <div className="message">Type "c" followed by your prompt in the command bar to chat with the AI</div>
      )}
    </div>
  );
}

export default Chat;
