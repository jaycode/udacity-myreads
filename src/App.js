import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route, Link } from 'react-router-dom'
import Search from './Search'
import BookShelf from './BookShelf'

class BooksApp extends React.Component {
  state = {
    books: []
  }
  
  moveBook(to, book, e) {
    BooksAPI.update(book, to)
      .then((function(response) {
        let newbooks = this.state.books.map(b => {
          b.shelf = ''
          return b
        })
        for (const k in response) {
          for (const id of response[k]) {
            newbooks[newbooks.findIndex(b => b.id === id)].shelf = k
          }
        }
        
        this.setState({books: newbooks})
      }).bind(this))
  }

  addNewBook(to, book, e) {
    const bookExists = this.state.books.filter(b => b.id === book.id).length === 0 ? false : true
    if (!bookExists) {
      book.shelf = to
      BooksAPI.update(book, to)
        .then((function(response) {
          let newbooks = this.state.books.concat(book).map(b => {
            b.shelf = ''
            return b
          })
          for (const k in response) {
            for (const id of response[k]) {
              newbooks[newbooks.findIndex(b => b.id === id)].shelf = k
            }
          }
          
          this.setState({books: newbooks})
        }).bind(this))

    }
    else {
      this.moveBook(to, book, e)
    }

  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState({books: books})
      })
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <Search shelfBooks={this.state.books} onMenuClick={this.addNewBook.bind(this)} />
        )} />
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  id="currentlyReading"
                  title="Currently Reading"
                  books={this.state.books.filter(book => book.shelf === 'currentlyReading')}
                  onMenuClick={this.moveBook.bind(this)} />
                <BookShelf
                  id="wantToRead"
                  title="Want To Read"
                  books={this.state.books.filter(book => book.shelf === 'wantToRead')}
                  onMenuClick={this.moveBook.bind(this)} />
                <BookShelf
                  id="read"
                  title="Read"
                  books={this.state.books.filter(book => book.shelf === 'read')}
                  onMenuClick={this.moveBook.bind(this)} />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search" >Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
