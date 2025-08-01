import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { LoginForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export default function Login() {
  return (
    <AuthPageLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Sign in to your account</h2>
          <p className="text-center text-gray-400">Welcome back to XTasker</p>
        </div>
        
        <LoginForm />
        
        <div className="space-y-4 text-center">
          <div className="text-sm">
            <span className="text-gray-400">Don't have an account? </span>
            <WaspRouterLink 
              to={routes.SignupRoute.to} 
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign up
            </WaspRouterLink>
          </div>
          
          <div className="text-sm">
            <WaspRouterLink 
              to={routes.RequestPasswordResetRoute.to} 
              className="font-medium text-gray-400 hover:text-gray-300 transition-colors"
            >
              Forgot your password?
            </WaspRouterLink>
          </div>
        </div>
      </div>
    </AuthPageLayout>
  );
}
