import type { Note, NoteTag } from '../../types/note';
import type { FormValues } from '../../types/form';
import { useState } from 'react';
import css from './App.module.css';
import { useFetchNotes } from '../../hooks/useFetchNotes';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { deleteNote, createNote } from '../../services/noteService';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

export default function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useFetchNotes(page, debouncedSearch);

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.perPage ?? 12)));

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      queryClient.invalidateQueries({ queryKey: ['notes', page, debouncedSearch] });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleCreate = async (values: FormValues) => {
    const noteToCreate: Omit<Note, 'id'> = {
      ...values,
      tag: values.tag as NoteTag,
    };
    try {
      await createNote(noteToCreate);
      queryClient.invalidateQueries({ queryKey: ['notes', page, debouncedSearch] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={setSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}

      {Array.isArray(data?.notes) && data.notes.length > 0 ? (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      ) : (
        !isLoading && !isError && <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleCreate}
          />
        </Modal>
      )}
    </div>
  );
}