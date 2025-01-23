import React, { useState, useRef, useEffect } from "react";
import Layout from "../../Layout/Layout";
import axios from "axios";
import Spline from '@splinetool/react-spline';

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // Store messages as an array
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const messageEndRef = useRef(null); // Reference for the end of the messages

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();

    // Add user question to messages
    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    setQuestion(""); // Clear input field
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyA5isHdIscq9RUDiPVgdqQuaeMDxV8RZgY`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      // Extract and clean the response text
      const rawBotMessage = response.data.candidates[0].content.parts[0].text;
      const cleanedBotMessage = rawBotMessage.replace(/\*/g, ""); // Remove asterisks

      const botMessage = {
        type: "bot",
        text: cleanedBotMessage,
      };

      // Add bot response to messages
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log(error);
      const errorMessage = {
        type: "bot",
        text: "Sorry - Something went wrong. Please try again!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setGeneratingAnswer(false);
  }

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Layout>
      <div className="min-h-screen p-5">
        {/* Page Heading at the Top */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            LMS <span className="text-yellow-300">IntelliBot</span>: Your AI-Powered Helper
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            Engage in Real-Time, Intelligent Conversations
          </p>
        </div>

        {/* Main Section: Chat and Spline Components */}
        <div className="flex flex-col md:flex-row items-center justify-center h-full space-y-8 md:space-y-0 md:space-x-8 pt-[4rem]">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Spline
              scene="https://prod.spline.design/aLafBoQYvcb52exL/scene.splinecode"
              style={{ width: '600px', height: '500px' }} // Adjust as needed
            />
          </div>

          {/* Chat AI Container */}
          <div className="w-full md:w-2/3 lg:w-1/2 xl:w-[550px] rounded-lg shadow-2xl bg-gray-800 text-white flex flex-col h-[500px]">
            <div className="bg-gray-700 text-white text-center p-4 rounded-t-lg border-b">
              <h1 className="text-2xl font-bold">Chat AI</h1>
              <p className="text-sm text-yellow-300">Powered by LMS</p>
            </div>
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[450px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-700 text-white self-start"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messageEndRef} /> {/* Empty div to act as scroll target */}
            </div>

            {/* Input Form */}
            <form onSubmit={generateAnswer} className="flex border-t border-gray-600">
              <input
                required
                className="border-none rounded-lg w-full p-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask your question..."
              />
              <button
                type="submit"
                className={`bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ml-2 ${
                  generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={generatingAnswer}
              >
                {generatingAnswer ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChatBot;
