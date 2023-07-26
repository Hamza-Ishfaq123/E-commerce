import React from 'react'
import styles from './Pagination.module.scss'
import { useState } from 'react';

const Pagination = ({ currentPage, setCurrentPage, productsPerPage, totalProducts, }) => {
    const pageNumbers = [];
    const [pageNumberLimit, setPageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    const totalPages = totalProducts / productsPerPage;
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i)
    }

    //paginate
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);


    }
    //go to next page
    const paginateNext = () => {
        setCurrentPage(currentPage + 1);
        console.log(currentPage);
        //next page number set
        if (currentPage + 1 > maxPageNumberLimit) {
            console.log(currentPage);
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    }

    //go to previous page
    const paginatePrev = () => {
        setCurrentPage(currentPage - 1);
        console.log(currentPage);
        // Show prev set of pageNumbers
        if ((currentPage - 1) % pageNumberLimit === 0) {
            console.log("12");
          setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
      };


    return (
        <ul className={styles.pagination}>
            <li onClick={paginatePrev} className={currentPage === pageNumbers[0] ? `${styles.hidden}` : null}>Prev</li>
            {pageNumbers.map((number) => {
                if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
                    return (
                        <li
                            key={number}
                            onClick={() => paginate(number)}
                            className={currentPage === number ? `${styles.active}` : null}
                        >
                            {number}
                        </li>
                    );
                }
            })}
            <li onClick={paginateNext} className={currentPage === pageNumbers[pageNumbers.length - 1] ? `${styles.hidden}` : null}>Next</li>
            <p>
                <b className={styles.page}>{`page ${currentPage} `}</b>
                <span>of</span>
                <b>{` ${Math.ceil(totalPages)}`}</b>
            </p>
        </ul>


    )
}

export default Pagination
