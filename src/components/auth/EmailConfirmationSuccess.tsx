import { Button } from "@/components/ui/button";

interface EmailConfirmationSuccessProps {
  onProceedToLogin: () => void;
}

const EmailConfirmationSuccess = ({ onProceedToLogin }: EmailConfirmationSuccessProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8 text-[#00BF63]">
        Email Verified Successfully!
      </h1>
      <div className="space-y-6 text-center">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">
            Your email has been validated correctly!
          </h2>
          <p className="text-emerald-700 mb-4">
            Your account is now active and ready to use.
          </p>
        </div>
        <Button
          className="w-full"
          style={{
            backgroundColor: '#2144FF',
            color: 'white'
          }}
          onClick={onProceedToLogin}
        >
          Click here to login
        </Button>
      </div>
    </>
  );
};

export default EmailConfirmationSuccess;