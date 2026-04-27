import { useQuery } from '@tanstack/react-query';
import adminService from '../../features/admin/adminService';

export const useAdminUsers = () => useQuery({ queryKey: ['adminUsers'], queryFn: adminService.fetchAllUsers });
export const useAdminEvents = () => useQuery({ queryKey: ['adminEvents'], queryFn: adminService.fetchAllEvents });
export const useAdminOrders = () => useQuery({ queryKey: ['adminOrders'], queryFn: adminService.fetchAllOrders });
export const useAdminRatings = () => useQuery({ queryKey: ['adminRatings'], queryFn: adminService.fetchAllRatings });
export const useAdminCoupons = () => useQuery({ queryKey: ['adminCoupons'], queryFn: adminService.fetchAllCoupons });
