import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function useNavBar() {
  const router = useRouter();
  const { loggedInUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isHomePage = router.pathname === '/home';
  const isRegisterPage = router.pathname === '/register';

  return {
    loggedInUser,
    isHomePage,
    isRegisterPage,
    handleLogout,
    router
  };
}
