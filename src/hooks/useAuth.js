// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthService from '../api/AuthService';

export function useCurrentUser() {
  const qc = useQueryClient();
  return useQuery(
    ['user'],
    () => AuthService.fetchProfile(),
    {
      initialData: () => {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
      },
      onSuccess: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
      },
      onError: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      },
      retry: false,
    }
  );
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation(
    (creds) => AuthService.login(creds),
    {
      onSuccess: (user) => {
        qc.setQueryData(['user'], user);
      },
    }
  );
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation(
    (data) => AuthService.register(data),
    {
      onSuccess: () => {
        // nothing
      },
    }
  );
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation(
    () => AuthService.logout(),
    {
      onSuccess: () => {
        qc.removeQueries(['user']);
      },
    }
  );
}

export function useForgotPassword() {
  return useMutation(
    ({ email }) => AuthService.forgotPassword({ email })
  );
}

export function useResetPassword() {
  return useMutation(
    ({ token, new_password }) => AuthService.resetPassword({ token, new_password })
  );
}


export function useChangePassword() {
  return useMutation(data => AuthService.changePassword(data));
}

export function useDeleteAllIdeas() {
  return useMutation(() => AuthService.deleteAllIdeas());
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation(
    () => AuthService.deleteAccount(),
    {
      onSuccess: () => {
        AuthService.logout();
        qc.removeQueries(['user']);
      }
    }
  );
}