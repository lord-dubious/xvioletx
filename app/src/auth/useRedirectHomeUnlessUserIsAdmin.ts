import { useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useNavigate } from 'react-router-dom';

export function useRedirectHomeUnlessUserIsAdmin() {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useAuth();

  useEffect(() => {
    if (!isUserLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, isUserLoading, navigate]);

  return { user, isLoading: isUserLoading };
}
