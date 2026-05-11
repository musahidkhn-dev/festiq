import { useQuery, useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import eventService from '../../features/event/eventService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export const useEvents = (params = {}) => {
    return useQuery({
        queryKey: ['events', params],
        queryFn: () => eventService.fetchEvents(params),
        placeholderData: keepPreviousData
    });
};

export const useInfiniteEvents = (params = {}, limit = 9) => {
    return useInfiniteQuery({
        queryKey: ['events-infinite', params, limit],
        queryFn: ({ pageParam = 1 }) => 
            eventService.fetchEvents({ ...params, page: pageParam, limit }),
        getNextPageParam: (lastPage) => 
            lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
        initialPageParam: 1,
    });
};

export const useEventDetail = (id) => {
    return useQuery({
        queryKey: ['events', id],
        queryFn: () => eventService.fetchEvent(id),
        enabled: !!id
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: eventService.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
            queryClient.invalidateQueries({ queryKey: ['hostedEvents'] });
            toast.success('Event Created Successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create event');
        }
    });
};
export const useAddReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reviewData }) => eventService.addReview(id, reviewData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Review added successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add review');
        }
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reviewId }) => eventService.deleteReview(id, reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Review deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reviewId, reviewData }) => eventService.updateReview(id, reviewId, reviewData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
            toast.success('Review updated successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update review');
        }
    });
};

export const useHostEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: eventService.hostEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['hostedEvents'] });
            queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
            toast.success('Event Submitted for Approval!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to host event');
        }
    });
};

export const useMyHostedEvents = () => {
    return useQuery({
        queryKey: ['hostedEvents'],
        queryFn: eventService.fetchMyHostedEvents
    });
};

export const useModerateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, approvalStatus }) => eventService.moderateEvent(id, approvalStatus),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
            queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
            queryClient.invalidateQueries({ queryKey: ['hostedEvents'] });
            toast.success(`Event marked as ${data.event.approvalStatus}`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to moderate event');
        }
    });
};

export const useCreatorAnalytics = () => {
    const { user } = useSelector(state => state.auth);
    return useQuery({
        queryKey: ['creatorAnalytics'],
        queryFn: eventService.fetchCreatorAnalytics,
        enabled: !!user
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: eventService.deleteEvent,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['hostedEvents'] });
            queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
            queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
            toast.success(data.message || 'Event Deleted Successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete event');
        }
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }) => eventService.updateEvent(id, formData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['hostedEvents'] });
            queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
            queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
            toast.success(data.message || 'Event Updated Successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update event');
        }
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ oid, status }) => eventService.updateBookingStatus(oid, status),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
            queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
            toast.success(data.message || 'Status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    });
};

export const useToggleLike = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => eventService.toggleLike(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ['events', id] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update favorite status');
        }
    });
};
