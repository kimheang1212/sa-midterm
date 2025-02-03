"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const [botToken, setBotToken] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    // Load settings from localStorage on mount
    const storedBotToken = localStorage.getItem("telegram_bot_token");
    const storedChatId = localStorage.getItem("telegram_chat_id");

    if (storedBotToken) setBotToken(storedBotToken);
    if (storedChatId) setChatId(storedChatId);
  }, []);

  const handleSaveSettings = () => {
    if (!botToken || !chatId) {
      alert("Both Bot Token and Chat ID are required!");
      return;
    }

    // Save settings in localStorage
    localStorage.setItem("telegram_bot_token", botToken);
    localStorage.setItem("telegram_chat_id", chatId);

    setMessage("Settings saved successfully!");

    // Redirect to homepage after 1.5 seconds
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Settings</h2>

        {/* Bot Token Input */}
        <div className="mb-4">
          <label className="block font-medium">Telegram Bot Token</label>
          <input
            type="text"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Enter your Telegram Bot Token"
            required
          />
        </div>

        {/* Chat ID Input */}
        <div className="mb-4">
          <label className="block font-medium">Telegram Chat ID</label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Enter your Telegram Chat ID"
            required
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          Save Settings
        </button>

        {/* Success Message */}
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
