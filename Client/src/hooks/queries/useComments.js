import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import commentService from '../../features/comment/commentService';
import { toast } from 'react-toastify';

export const useComments = (eid) => {
    return useQuery({
        queryKey: ['comments', eid],
        queryFn: () => commentService.fetchComments(eid),
        enabled: !!eid
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eid, commentData }) => commentService.addComment(eid, commentData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.eid] });
            toast.success("Comment added successfully!");
        }
    });
};
