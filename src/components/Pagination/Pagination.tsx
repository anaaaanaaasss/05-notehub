import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selected: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={(event) => onPageChange(event.selected + 1)}
      containerClassName={css.pagination}
      pageClassName={css.page}
      pageLinkClassName={css.pageLink}
      previousLabel="←"
      nextLabel="→"
      previousClassName={css.page}
      previousLinkClassName={css.pageLink}
      nextClassName={css.page}
      nextLinkClassName={css.pageLink}
      breakLabel="..."
      breakClassName={css.page}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
    />
  );
};

export default Pagination;