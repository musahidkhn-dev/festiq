import { useQuery } from '@tanstack/react-query';
import orderService from '../../features/orders/orderService';

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
