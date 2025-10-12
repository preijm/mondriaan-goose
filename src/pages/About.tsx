import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import { Target, Zap, Users, Award, Search, Heart, Milk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BackgroundPattern from "@/components/BackgroundPattern";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTests: 0,
    brandsCovered: 0,
    activeMembers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: stats } = await supabase.rpc('get_public_stats');
        if (stats && stats.length > 0) {
          const stat = stats[0];
          setStats({
            totalTests: Number(stat.total_tests) || 0,
            brandsCovered: Number(stat.total_brands) || 0,
            activeMembers: Number(stat.total_members) || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
    }
    return num.toString() + '+';
  };

  const handleGetStarted = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth', { state: { from: '/add' } });
    } else {
      navigate('/add');
    }
  };

  return (
    <div className="min-h-screen">
      <MenuBar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8 lg:pb-12 relative overflow-hidden" style={{ backgroundColor: '#00bf63' }}>
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-2">
            <Milk className="w-4 h-4 mr-2" />
            Making dairy-free delicious
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Your Plant-Based
            <br />
            Milk Adventure
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Join {formatNumber(stats.activeMembers)} taste explorers
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#00bf63' }}>
                  {formatNumber(stats.activeMembers)}
                </div>
                <div className="text-sm md:text-base text-gray-600">Members</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#00bf63' }}>
                  {formatNumber(stats.brandsCovered)}
                </div>
                <div className="text-sm md:text-base text-gray-600">Brands</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#00bf63' }}>
                  {formatNumber(stats.totalTests)}
                </div>
                <div className="text-sm md:text-base text-gray-600">Reviews</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BackgroundPattern>
        <div className="py-12 lg:py-16">
          <div className="container max-w-4xl mx-auto px-4 space-y-6">
            
            {/* Mission Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00bf63' }}>
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Our Crazy Mission</h2>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      We're on a wild adventure to rescue taste buds from boring milk! Whether you're a coffee connoisseur or a cereal enthusiast, we're here to make your dairy-free dreams come true.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Roll Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0d44e7' }}>
                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">How We Roll</h2>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                      Our superhero community of milk testers dive deep into plant-based milks faster than you can say "udderly awesome"! We rate, we taste, we conquer the milk universe one sip at a time.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                        <Users className="w-3 h-3 mr-1" />
                        Community
                      </Badge>
                      <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                        <Award className="w-3 h-3 mr-1" />
                        Expert-rated
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="border-0 shadow-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)' }}>
              <CardContent className="p-8 md:p-10 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join Our Milk Mob</h2>
                <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Create an account and become a milk detective! Share your epic taste adventures, help others find their perfect plant-based sidekick, and let's make boring milk history!
                </p>
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-purple-600 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
                    <Milk className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{formatNumber(stats.brandsCovered)} Brands</h3>
                  <p className="text-sm text-gray-600">Complete database</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-yellow-100">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Real Reviews</h3>
                  <p className="text-sm text-gray-600">From users like you</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-100">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Smart Filters</h3>
                  <p className="text-sm text-gray-600">Find your match</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-pink-100">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Personalized</h3>
                  <p className="text-sm text-gray-600">Custom picks for you</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </BackgroundPattern>
      
      <MobileFooter />
    </div>
  );
};

export default About;