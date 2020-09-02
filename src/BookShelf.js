import React from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

const BookShelf = props => {
  return (
                <div className="bookshelf">
                  <h2 className="bookshelf-title">{props.title}</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {props.books.map((book) => ( 
                      <li key={book.id}>
                        <Book book={book} onMenuClick={props.onMenuClick} />
                      </li>
                    ))}
                    </ol>
                  </div>
                </div>
  )
}

BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array,
  onMenuClick: PropTypes.func.isRequired,
}

export default BookShelf