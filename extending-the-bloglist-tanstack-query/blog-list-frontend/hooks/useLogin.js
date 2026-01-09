import { useUserContext } from '../src/UserContext';

// Get user from context
const user = useUserContext();
export const useLogin = (e) => {
  e.preventDefault();
};
