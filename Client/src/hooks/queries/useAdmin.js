import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../features/admin/adminService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export const useAdminUsers = (params) => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminUsers', params], 
        queryFn: () => adminService.fetchAllUsers(params),
        enabled: !!user?.isAdmin,
        keepPreviousData: true
    });
};

export const useAdminUserDetails = (uid) => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminUserDetails', uid], 
        queryFn: () => adminService.fetchUserDetails(uid),
        enabled: !!user?.isAdmin && !!uid
    });
};

export const useAdminEvents = (params) => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminEvents', params], 
        queryFn: () => adminService.fetchAllEvents(params),
        enabled: !!user?.isAdmin,
        keepPreviousData: true
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success("Event deleted successfully!");
        }
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eid, eventData }) => adminService.updateEvent(eid, eventData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success("Event updated successfully!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update event");
        }
    });
};

export const useAdminOrders = (params) => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminOrders', params], 
        queryFn: () => adminService.fetchAllOrders(params),
        enabled: !!user?.isAdmin,
        keepPreviousData: true
    });
};

export const useAdminRatings = () => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminRatings'], 
        queryFn: adminService.fetchAllRatings,
        enabled: !!user?.isAdmin 
    });
};

export const useAdminCoupons = () => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminCoupons'], 
        queryFn: adminService.fetchAllCoupons,
        enabled: !!user?.isAdmin 
    });
};

export const useAdminAnalytics = () => {
    const { user } = useSelector(state => state.auth);
    return useQuery({ 
        queryKey: ['adminAnalytics'], 
        queryFn: adminService.fetchAllAnalytics,
        enabled: !!user?.isAdmin 
    });
};


export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.createCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
            toast.success("Coupon created successfully!");
        }
    });
};

export const useUpdateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cid, couponData }) => adminService.updateCoupon(cid, couponData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
            toast.success("Coupon updated successfully!");
        }
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ uid, userData }) => adminService.updateUser(uid, userData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            
            if (variables.userData.hasOwnProperty('isActive')) {
                if (variables.userData.isActive) {
                    toast.success("User enabled successfully");
                } else {
                    toast.error("User disabled successfully");
                }
            } else if (variables.userData.hasOwnProperty('credits')) {
                toast.success(`Credits updated successfully`);
            } else {
                toast.success("User updated successfully!");
            }
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success("User permanently deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ oid, orderData }) => adminService.updateOrderStatus(oid, orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success("Order status updated!");
        }
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success("Order deleted successfully!");
        }
    });
};

export const useDeleteCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success("Coupon deleted successfully!");
        }
    });
};

export const useAssignCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.assignCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
            toast.success("Coupon assigned to user!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to assign coupon");
        }
    });
};
