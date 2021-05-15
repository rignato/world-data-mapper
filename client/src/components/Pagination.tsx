import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

type Props = {
    pageCount: number;
    currentPage: number;
    onPageChange: any;
};

export const usePaginate = (currentPage: number, pageCount: number, neighbors: number) => {
    const pageNumbersWithDots: string[] = [];
    const updatePagination = (currentPageNew: number, pageCountNew: number, neighborsNew: number = neighbors) => {
        pageNumbersWithDots.length = 0;
        const pageNumbers = [];
        for (let i = 1; i <= pageCountNew; i++) {
            if (i === 1 ||
                i === pageCountNew ||
                Math.abs(currentPageNew - i) <= neighborsNew ||
                (Math.abs(pageCountNew - currentPageNew) <= (neighborsNew + 2) && Math.abs(pageCountNew - i) <= (neighborsNew + 2)) ||
                (Math.abs(currentPageNew - 1) <= (neighborsNew + 2) && Math.abs(i - 1) <= (neighborsNew + 2)))
                pageNumbers.push(i);
        }
        let prev = 0;
        for (let i of pageNumbers) {
            if (i - prev > 1)
                pageNumbersWithDots.push('...');
            pageNumbersWithDots.push(i.toLocaleString());
            prev = i;
        }
    }

    updatePagination(currentPage, pageCount, neighbors);

    return { pages: pageNumbersWithDots, updatePages: updatePagination };
};

const Pagination = ({ pageCount, currentPage, onPageChange }: Props) => {

    const { pages, updatePages } = usePaginate(currentPage, pageCount, 1);

    useEffect(() => {
        updatePages(currentPage, pageCount);
    }, [pageCount, currentPage, updatePages])

    const handlePageChange = async (newPage: number) => {
        await onPageChange(newPage);
    };

    return (
        <nav className={`pagination is-centered is-medium ${pageCount === 1 ? "is-invisible" : ""}`} role="navigation">
            {<button className={`button pagination-previous is-white ${(currentPage === 1 || pageCount <= 1) ? "is-invisible" : ""}`} onClick={() => handlePageChange(currentPage - 1)}><FontAwesomeIcon icon={faAngleLeft} /></button>}
            {<button className={`button pagination-next is-white ${(currentPage === pageCount || pageCount <= 1) ? "is-invisible" : ""}`} onClick={() => handlePageChange(currentPage + 1)}><FontAwesomeIcon icon={faAngleRight} /></button>}


            <ul className="pagination-list">
                {
                    pages.map((page: string, index: number) => (
                        page === "..." ?
                            <li key={`${index}.${page}`}>
                                <span className="pagination-ellipsis">&hellip;</span>
                            </li>
                            :
                            <li key={`${index}.${page}`}>
                                <button
                                    className={
                                        `button pagination-link is-white ${currentPage === parseInt(page) ? "has-text-info has-text-weight-bold" : ""}
                                        `}
                                    onClick={() => handlePageChange(parseInt(page))}
                                >{page}
                                </button>
                            </li>
                    ))
                }
            </ul>
        </nav>
    )
}

export default Pagination;