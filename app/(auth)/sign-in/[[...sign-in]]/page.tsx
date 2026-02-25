import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to Chat App</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-white shadow-xl rounded-xl border-0",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
              socialButtonsBlockButtonText: "text-gray-700 font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-700 font-medium",
              formFieldInput: "border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
              identityPreviewText: "text-gray-700",
              identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
            }
          }}
          afterSignInUrl="/chat"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}