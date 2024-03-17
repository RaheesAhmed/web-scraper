"use client";
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userInput: userInput
      })
    })
    .then(response => response.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error:', error);
      setLoading(false);
    });
  }

  const formatContent = (content) => {
    const maxLength = 200;
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl mb-8">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex-grow bg-gray-200 border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:border-purple-500 flex items-center">
            <input id="search-input" className="bg-transparent w-full outline-none focus:outline-none" type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Search..." />
          </div>
          <button className=" hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors " type="submit">
            <FiSearch className="text-gray-500 mr-2" />
          </button>
        </form>
      </div>

      <div className="w-full max-w-3xl">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-purple-200 rounded"></div>
                  <div className="h-4 bg-purple-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
              <a href={item.articleUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-purple-600 hover:underline">
  {item.articleTitle}
</a>
              <p className="mt-2 text-gray-900">{formatContent(item.articleContent)}</p>
              <p className="mt-2 text-gray-500">{item.articleDate}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
