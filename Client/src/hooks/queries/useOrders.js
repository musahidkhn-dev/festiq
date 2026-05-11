import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '../../features/orders/orderService';
import { toast } from 'react-toastify';

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: orderService.fetchTickets
    });
};

export const useOrderDetail = (tid) => {
    return useQuery({
        queryKey: ['orders', tid],
        queryFn: () => orderService.fetchTicket(tid),
        enabled: !!tid
    });
};

export const useBookTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => orderService.bookTicket(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success("Ticket booked successfully!");
        }
    });
};

export const useCancelTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tid) => orderService.cancelTicket(tid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success("Ticket cancelled.");
        }
    });
};
export const useValidateCoupon = () => {
    return useMutation({
        mutationFn: (couponData) => orderService.validateCoupon(couponData),
        onSuccess: (data) => {
            const discountLabel = data.coupon.type === 'percentage' ? `${data.coupon.discount}%` : `₹${data.coupon.discount}`;
            toast.success(`Coupon Applied! ${discountLabel} Discount.`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Invalid coupon code");
        }
    });
};

export const useUserCoupons = () => {
    return useQuery({
        queryKey: ['userCoupons'],
        queryFn: orderService.fetchMyCoupons
    });
};
