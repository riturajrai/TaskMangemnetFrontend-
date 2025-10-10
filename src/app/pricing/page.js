"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, ChevronRight, CircleDot } from "lucide-react";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Perfect for individuals starting with task management",
      features: [
        "Up to 5 projects",
        "Basic task management",
        "Email support",
        "1 user",
      ],
      cta: "Get Started",
      ctaLink: "/register",
    },
    {
      name: "Pro",
      monthlyPrice: 29,
      annualPrice: 290,
      description: "Ideal for growing teams needing advanced features",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Up to 10 users",
        "Custom integrations",
      ],
      cta: "Start Free Trial",
      ctaLink: "/register",
      highlighted: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: null,
      annualPrice: null,
      description: "Custom solutions for large organizations",
      features: [
        "Unlimited projects",
        "Dedicated support",
        "Custom workflows",
        "Unlimited users",
        "Enterprise-grade security",
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-16 text-[12px] font-[Inter] relative">
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 blur-3xl animate-pulse z-0" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
        >
          Flexible Pricing for Every Team
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-xl mx-auto"
        >
          Choose the plan that fits your team&apos;s needs. Start for free, upgrade anytime.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center items-center gap-4 mt-6"
        >
          <span className={`font-semibold ${isAnnual ? "text-slate-600" : "text-indigo-600"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all duration-200"
          >
            <Award className={`h-6 w-6 ${isAnnual ? "text-indigo-600" : "text-slate-600"}`} />
          </button>
          <span className={`font-semibold ${isAnnual ? "text-indigo-600" : "text-slate-600"}`}>
            Annual (Save up to 20%)
          </span>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative ${plan.highlighted ? "border-2 border-indigo-600 shadow-lg" : "border border-slate-200"} bg-white rounded-lg p-6`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="text-slate-600 mt-2">{plan.description}</p>
              <div className="text-2xl font-bold text-slate-900 mt-4">
                {plan.monthlyPrice === null ? (
                  "Custom"
                ) : isAnnual ? (
                  <span>${plan.annualPrice}/yr</span>
                ) : (
                  <span>${plan.monthlyPrice}/mo</span>
                )}
              </div>
              <ul className="space-y-2 mt-4 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-slate-600">
                    <CircleDot className="h-4 w-4 text-indigo-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.ctaLink}
                className={`block w-full py-3 text-center font-semibold rounded-lg ${plan.highlighted ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"} transform hover:scale-105 transition-all duration-200`}
              >
                {plan.cta}
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Signals */}
      <div className="max-w-7xl mx-auto mt-12 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-slate-600 mb-6"
        >
          Trusted by over 30,000 professionals worldwide
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <Award key={i} className="h-4 w-4 text-indigo-600" />
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-slate-600 mt-4"
        >
          &quot;TaskFlow has transformed our workflow with its intuitive design and powerful features.&quot; — Sarah J., Project Director
        </motion.p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto mt-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-slate-900 text-center mb-6"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{
            question: "Can I try TaskFlow for free?",
            answer: "Yes, our Basic plan is free forever, with no credit card required. You can upgrade anytime.",
          }, {
            question: "What is the difference between monthly and annual billing?",
            answer: "Annual billing saves you up to 20% compared to monthly billing. You can switch at any time.",
          }, {
            question: "Is my data secure with TaskFlow?",
            answer: "Absolutely. We use end-to-end encryption and comply with SOC 2 standards to protect your data.",
          }, {
            question: "Can I upgrade or downgrade my plan?",
            answer: "Yes, you can change your plan at any time from your account settings with no penalties.",
          }].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border border-slate-200"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto mt-12 text-center bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-12 rounded-lg relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold mb-4"
        >
          Ready to Boost Your Team&apos;s Productivity?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-200 mb-6 max-w-xl mx-auto"
        >
          Join thousands of teams using TaskFlow to streamline workflows and achieve results.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/register"
            className="inline-block px-6 py-3 font-semibold bg-white text-indigo-700 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Free Trial
            <ChevronRight className="inline ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;