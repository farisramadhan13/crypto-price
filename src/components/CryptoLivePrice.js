import React, { useState, useEffect } from 'react';

const CryptoLivePrice = () => {
  const [cryptoData, setCryptoData] = useState({});

  useEffect(() => {
    const symbols = [
      'btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'dogeusdt'
    ];

    const formatSymbol = (symbol) => {
      return symbol.toLowerCase() + '@ticker';
    };

    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      console.log('Connected to Binance WebSocket');

      // Subscribe ke setiap simbol yang diinginkan
      symbols.forEach(symbol => {
        ws.send(JSON.stringify({ "method": "SUBSCRIBE", "params": [formatSymbol(symbol)], "id": 1 }));
      });
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Pastikan data adalah respons ticker
      if (message.e === '24hrTicker') {
        setCryptoData(prevData => ({
          ...prevData,
          [message.s]: {
            symbol: message.s,
            lastPrice: message.c,
            priceChange: message.p,
            priceChangePercent: message.P,
            highPrice: message.h,
            lowPrice: message.l
          }
        }));
      }
    };

    ws.onclose = () => {
      console.log('Connection to Binance WebSocket closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 bg-black min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center text-white">Live Cryptocurrency Prices</h2>
      <div className="flex flex-wrap justify-center">
        {Object.values(cryptoData).map((info, index) => (
          <div key={index} className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg p-4 m-4 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold mb-2 text-white">{info.symbol}</h3>
            <p className={`mb-2 ${info.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Last Price: ${info.lastPrice}
            </p>
            <p className={`mb-2 ${info.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Price Change: ${info.priceChange} (${info.priceChangePercent}%)
            </p>
            <p className="mb-2 text-gray-300">High Price: ${info.highPrice}</p>
            <p className="mb-2 text-gray-300">Low Price: ${info.lowPrice}</p>
          </div>
        ))}
      </div>
      <div className='text-white text-center w-full text-xl p-4 font-semibold'>Created by Faris Ramadhan 2024</div>
    </div>
  );
};

export default CryptoLivePrice;
