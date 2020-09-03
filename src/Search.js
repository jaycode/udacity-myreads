import React from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import PropTypes from 'prop-types'
import Book from './Book'
import { throttle, debounce } from 'throttle-debounce';

class Search extends React.Component {
  state = {
    books: [],
    lastQuery: ''
  }

  search(query, maxResult = 20) {
    if (query !== '') {
      BooksAPI.search(query, maxResult)
        .then((books = []) => {
          if (books.error !== undefined) {
            books = []
          }
          else {
            for (const i in books) {
              const shelfBooks = this.props.shelfBooks
                .filter(book => book.id === books[i].id)
              const shelf = shelfBooks.length > 0 ? shelfBooks[0].shelf : 'none'
              books[i].shelf = shelf
            }
          }
          this.setState({books: books, lastQuery: query})
        })
    }
    else {
      this.setState({books: [], lastQuery: query})
    }
  }

  noBooksFound() {
    return (this.state.lastQuery != '' && this.state.books.length == 0)
  }

  componentDidMount() {
    // this.search('')
  }

  onChange(e) {
    e.persist()
    if (!this.dbfunc) {
      this.dbfunc =  debounce(500, () => {
         this.search(e.target.value)
      });
    }
    this.dbfunc()
  }
  
  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
          {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
            <input type="text" placeholder="Search by title or author" onChange={this.onChange.bind(this)}/>

          </div>
        </div>
        <div className="search-books-results">
          {(this.noBooksFound()) ? "No books found" : 
            (this.state.books.length == 0 ? "Enter a query to begin the search e.g. 'Android', 'Artificial Intelligence'" : "")} 
          <ol className="books-grid">
            {this.state.books.map((book) => (
              <li key={book.id}>
                <Book book={book} onMenuClick={this.props.onMenuClick} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}
            
Search.propTypes = {
  shelfBooks: PropTypes.array.isRequired,
  onMenuClick: PropTypes.func.isRequired
}

export default Search