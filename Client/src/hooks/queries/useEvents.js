import { useQuery } from '@tanstack/react-query';
import eventService from '../../features/event/eventService';

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: eventService.fetchEvents
    });
};

export const useEventDetail = (id) => {
    return useQuery({
        queryKey: ['events', id],
        queryFn: () => eventService.fetchEvent(id),
        enabled: !!id
    });
};
