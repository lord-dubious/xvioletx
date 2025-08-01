import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { SignupForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export function Signup() {
  return (
    <AuthPageLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Create your account</h2>
          <p className="text-center text-gray-400">Join XTasker and boost your productivity</p>
        </div>
        
        <SignupForm />
        
        <div className="text-center">
          <span className="text-gray-400">Already have an account? </span>
          <WaspRouterLink 
            to={routes.LoginRoute.to} 
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign in
          </WaspRouterLink>
        </div>
      </div>
    </AuthPageLayout>
  );
}
