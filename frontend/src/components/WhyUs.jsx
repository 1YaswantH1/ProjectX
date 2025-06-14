import React from "react";

const WhyUs = () => {
  return (
    <section className="bg-base-200 py-12 px-4 text-base-content">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl p-6">
          <h3 className="text-xl font-semibold">Fast Delivery</h3>
          <p>We deliver your product within 24 hours, guaranteed.</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-6">
          <h3 className="text-xl font-semibold">Affordable Prices</h3>
          <p>Our pricing model is simple, transparent, and fair.</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-6">
          <h3 className="text-xl font-semibold">24/7 Support</h3>
          <p>Get help whenever you need it, day or night.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
