import React from "react";
import { Beaker, Award, Users, Heart } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import { Navigation } from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen">
      <MenuBar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-emerald-50/80 relative overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM0OS42NzkgMjQxLjQzN0MtMjI5LjU1MSA5Ny4zNzYgMTA1LjY0OSAtODEuNjk5NyAzOTcuNzEgNjUuNzk5N0M2ODkuNzcxIDIxMy4yOTkgOTE2LjQ4OCA0MjguODE0IDEwNjEuMDEgNTE5LjIzQzEyMDUuNTMgNjA5LjY0NiAxNTMyLjI1IDU0My40ODQgMTY5NS42MSA0NzQuODIyIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcikiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjY3MyIgeTE9IjAiIHgyPSI2NzMiIHkyPSI1NzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMEVCNUI1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzREMzk5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')] opacity-40 animate-[wave_10s_ease-in-out_infinite] will-change-transform" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM0OS42NzkgMjQxLjQzN0MtMjI5LjU1MSA5Ny4zNzYgMTA1LjY0OSAtODEuNjk5NyAzOTcuNzEgNjUuNzk5N0M2ODkuNzcxIDIxMy4yOTkgOTE2LjQ4OCA0MjguODE0IDEwNjEuMDEgNTE5LjIzQzEyMDUuNTMgNjA5LjY0NiAxNTMyLjI1IDU0My40ODQgMTY5NS42MSA0NzQuODIyIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcikiIHN0cm9rZS13aWR0aD0iMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjY3MyIgeTE9IjAiIHgyPSI2NzMiIHkyPSI1NzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMzREMzk5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEVCNUI1Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')] opacity-30 animate-[wave_15s_ease-in-out_infinite_reverse] will-change-transform scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 backdrop-blur-[1px] animate-pulse" />

        <div className="container max-w-5xl mx-auto px-4 py-8 relative z-10">
          <Navigation />
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About Dairy Taste Trove</h1>
        
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-milk-500 mb-8">
              Welcome to Dairy Taste Trove, your personal companion for exploring and documenting
              the diverse world of dairy products. Our mission is to help milk enthusiasts track
              and share their tasting experiences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start space-x-4">
                <Beaker className="w-8 h-8 text-milk-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Methodology</h3>
                  <p className="text-milk-500">
                    We use a simple yet effective 5-star rating system, combined with detailed notes
                    to capture the complete tasting experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-milk-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Focus</h3>
                  <p className="text-milk-500">
                    Each rating considers taste, texture, freshness, and overall drinking experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 text-milk-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
                  <p className="text-milk-500">
                    Built by and for milk enthusiasts who appreciate the nuances of dairy products.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Heart className="w-8 h-8 text-milk-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
                  <p className="text-milk-500">
                    We believe in transparency, authenticity, and sharing knowledge about dairy products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
