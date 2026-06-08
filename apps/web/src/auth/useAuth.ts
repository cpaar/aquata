import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  getMe,
  login,
  logout,
  register,
  type LoginPayload,
  type RegisterPayload,
} from "../api/auth.js";
import { ApiError } from "../api/client.js";
import { queryKeys } from "../api/queries.js";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(queryKeys.auth.me, data);
      await queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot });
      await navigate({ to: "/" });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(queryKeys.auth.me, data);
      await queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot });
      await navigate({ to: "/" });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: "/auth" });
    },
  });
}
