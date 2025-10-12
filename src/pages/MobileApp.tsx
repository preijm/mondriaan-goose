import MenuBar from "@/components/MenuBar";
import MobileFooter from "@/components/MobileFooter";
import BackgroundPattern from "@/components/BackgroundPattern";
import { Smartphone, Download, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MobileApp = () => {
  const copyToClipboard = () => {
    const repoUrl = "https://github.com/yourusername/mondriaan-goose";
    navigator.clipboard.writeText(repoUrl);
    toast.success("Repository link copied to clipboard!");
  };

  return (
    <div className="min-h-screen">
      <MenuBar />
      <BackgroundPattern>
        <div className="container max-w-2xl mx-auto px-4 pt-24 pb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative z-10">
            {/* App Icon and Title */}
            <div className="flex flex-col items-center mb-8">
              <img 
                src="/lovable-uploads/9f030b65-074a-4e64-82d9-f0eba7246e1a.png" 
                alt="Milk Me Not Logo" 
                className="h-24 w-24 mb-4 rounded-2xl shadow-lg"
              />
              <h1 className="text-3xl font-bold text-gray-900">Milk Me Not</h1>
            </div>

            {/* Instructions */}
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Get the native mobile app experience on your Android or iOS device
              </p>
            </div>

            {/* Installation Steps */}
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#00bf63] text-white rounded-full text-sm">1</span>
                  Export to GitHub
                </h3>
                <p className="text-gray-600 text-sm ml-8">
                  Export this project to your GitHub repository using the export button
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#00bf63] text-white rounded-full text-sm">2</span>
                  Clone and Setup
                </h3>
                <div className="text-gray-600 text-sm ml-8 space-y-2">
                  <p>Clone your repository and run:</p>
                  <code className="block bg-white px-3 py-2 rounded border border-gray-200 text-xs">
                    npm install<br/>
                    npx cap add android<br/>
                    npm run build<br/>
                    npx cap sync
                  </code>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-[#00bf63] text-white rounded-full text-sm">3</span>
                  Build and Run
                </h3>
                <p className="text-gray-600 text-sm ml-8">
                  Open the project in Android Studio or Xcode and build the app
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={copyToClipboard}
                variant="outline" 
                className="w-full py-6 text-base"
              >
                <Copy className="mr-2 h-5 w-5" />
                Copy repository link to clipboard
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help? Learn more in our{" "}
                <a 
                  href="https://docs.lovable.dev/features/mobile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2144ff] hover:underline inline-flex items-center gap-1"
                >
                  documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </BackgroundPattern>
      <MobileFooter />
    </div>
  );
};

export default MobileApp;
