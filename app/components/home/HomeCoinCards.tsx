import React from "react";

const coins = [
  {
    name: "Bitcoin (BTC)",
    price: "۱۱۷۹۴۸",
    icon: "/images/bitcoin.png",
    bgIcon: "/images/bitcoin.png",
    color: "#f7931a",
  },
  {
    name: "Ethereum (ETH)",
    price: "۳۱۴۳",
    icon: "/images/ethereum.png",
    bgIcon: "/images/ethereum.png",
    color: "#627eea",
  },
  {
    name: "XRP (XRP)",
    price: "۲",
    icon: "/images/xrp.png",
    bgIcon: "/images/xrp.png",
    color: "#23292f",
  },
  {
    name: "Cardano (ADA)",
    price: "۰",
    icon: "/images/cardano.png",
    bgIcon: "/images/cardano.png",
    color: "#0033ad",
  },
];

export default function HomeCoinCards() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {coins.map((coin) => (
          <div
            key={coin.name}
            className="relative rounded-lg overflow-hidden shadow bg-[var(--surface-light)] dark:bg-[var(--surface-dark)] p-6 flex flex-col justify-between min-h-[180px]"
          >
            {/* Background Icon */}
            <img
              src={coin.bgIcon}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none select-none"
            />
            {/* Main Icon and Name */}
            <div className="flex items-center z-10 relative">
              <img
                src={coin.icon}
                alt={coin.name}
                className="w-10 h-10 rounded-full border-2"
                style={{ borderColor: coin.color }}
              />
              <span className="ml-3 text-white font-bold" style={{ color: coin.color }}>{coin.name}</span>
            </div>
            {/* Price */}
            <div className="mt-8 z-10 flex gap-6 items-center relative">
              <div className="text-md text-gray-600 mb-1">قیمت   : </div>
              <div className="text-2xl font-bold text-gray-600">${coin.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
