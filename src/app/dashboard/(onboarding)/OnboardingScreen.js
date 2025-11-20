
"use client";

import React, { useState } from "react";
export default function OnboardScreen() {
  const [isYearly, setIsYearly] = useState(false);

  const getPricing = (monthlyPrice) => {
    if (monthlyPrice === 0) return { price: 0, period: "/month" };
    const price = isYearly ? Math.floor(monthlyPrice * 12 * 0.75) : monthlyPrice;
    const period = isYearly ? "/year" : "/month";
    return { price, period };
  };
  const handlePlanSelect = (planName) => {
    alert(`You selected the ${planName} plan!`);
  };
  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 leading-snug">
            Powerful features for{" "}
            <span className="text-blue-500">powerful creators</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Choose a plan that’s right for you
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <span
              className={`text-xs sm:text-sm ${
                !isYearly ? "text-gray-800 font-semibold" : "text-gray-600"
              }`}
            >
              Pay Monthly
            </span>
            <div
              className="relative inline-block w-10 sm:w-12 h-5 sm:h-6 bg-gray-300 rounded-full cursor-pointer"
              onClick={() => setIsYearly(!isYearly)}
            >
              <div
                className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isYearly ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
                }`}
              ></div>
            </div>
            <span
              className={`text-xs sm:text-sm ${
                isYearly ? "text-gray-800 font-semibold" : "text-gray-600"
              }`}
            >
              Pay Yearly
            </span>
            <span className="text-[10px] sm:text-xs text-blue-500 font-semibold">
              Save 25%
            </span>
          </div>
        </div>  

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              name: "Free",
              price: getPricing(0),
              desc: "All the basic features to boost your career",
              border: "border-gray-200",
              highlight: false,
            },
            {
              name: "Pro",
              price: getPricing(49),
              desc: "All the pro features for serious creators",
              border: "border-blue-500",
              highlight: true,
            },
            {
              name: "Max",
              price: getPricing(99),
              desc: "Maximize growth with enterprise features",
              border: "border-gray-200",
              highlight: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`bg-white ${plan.border} border-2 rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-center hover:shadow-lg transition-transform duration-300 ${
                plan.highlight ? "shadow-md scale-[1.02]" : ""
              }`}
            >
              <div>
                <p className="text-sm text-gray-600 mb-1">{plan.name}</p>
                <div className="flex justify-center items-baseline mb-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                    ${plan.price.price}
                  </span>
                  <span className="text-gray-500 ml-1 sm:ml-2 text-xs sm:text-sm">
                    {plan.price.period}
                  </span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  {plan.desc}
                </p>
                <hr className="my-4 border-gray-200" />
                <ul className="space-y-2 sm:space-y-3 mb-6 text-left sm:text-center">
                  <li className="flex sm:justify-center items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-gray-700">
                      Full Access to Platform
                    </span>
                  </li>
                  <li className="flex sm:justify-center items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-gray-700">100 GB Free Storage</span>
                  </li>
                  <li className="flex sm:justify-center items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-gray-700">Unlimited Visitors</span>
                  </li>
                  <li className="flex sm:justify-center items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-gray-700">10 Agents</span>
                  </li>
                  <li className="flex sm:justify-center items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-gray-700">Live Chat Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.name === "Free"
                  ? "Get Started"
                  : plan.name === "Pro"
                  ? "Start 14-Day Trial"
                  : "Contact Sales"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
