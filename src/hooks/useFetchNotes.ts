import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../services/noteService';
import type { FetchNotesResponse } from '../services/noteService';

export const useFetchNotes = (page: number, search: string) => {
  return useQuery<FetchNotesResponse, Error, FetchNotesResponse, [string, number, string]>({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: (previousData) => previousData,
  });
};