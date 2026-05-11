import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import authService from '../../features/auth/authService';
import { toast } from 'react-toastify';

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: authService.fetchProfile,
        retry: false,
        enabled: !!localStorage.getItem('user'),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success(data.message || "Profile updated successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: authService.changePassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password changed successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to change password");
        }
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
    });
};

export const useUpdateAvatar = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: authService.updateAvatar,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            // Update Redux state as well
            dispatch({ type: 'auth/loginUser/fulfilled', payload: data });
            toast.success(data.message || "Avatar updated successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update avatar");
        }
    });
};

export const useDeleteAvatar = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: authService.deleteAvatar,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            // Update Redux state as well
            dispatch({ type: 'auth/loginUser/fulfilled', payload: data });
            toast.success(data.message || "Avatar removed successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to remove avatar");
        }
    });
};
