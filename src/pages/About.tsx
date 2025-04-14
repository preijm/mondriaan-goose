
import React from "react";
import MenuBar from "@/components/MenuBar";

const About = () => {
  return (
    <div className="min-h-screen">
      <MenuBar />
      <div className="min-h-screen pt-16 bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">About Milk Me Not</h1>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Our Mission</h2>
                <p className="text-gray-700">
                  Milk Me Not is dedicated to helping people find the best plant-based milk alternatives 
                  that suit their taste preferences and needs. Whether you're looking for the perfect milk 
                  for your morning coffee, cereal, or cooking, we've got you covered with real reviews from 
                  real people.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">How It Works</h2>
                <p className="text-gray-700">
                  Our community members test and review plant-based milks across different categories, considering 
                  taste, texture, performance in coffee and tea, cooking applications, and more. We aggregate these 
                  reviews to provide comprehensive insights into each product.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Join Our Community</h2>
                <p className="text-gray-700">
                  Create an account to start contributing your own reviews. Your experiences help others 
                  make better choices when shopping for plant-based milk alternatives. The more reviews we 
                  collect, the more valuable our service becomes!
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Contact Us</h2>
                <p className="text-gray-700">
                  Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to us at 
                  <a href="mailto:info@milkmenot.com" className="text-emerald-600 ml-1 hover:underline">
                    info@milkmenot.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
