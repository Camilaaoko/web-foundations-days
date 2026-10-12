# Library REST API Design

## Resource: `/books`

### Endpoints

1. **List all books**
   - **Method:** `GET`
   - **Path:** `/books`
   - **Description:** Retrieves a list of all books in the library catalog.
   - **Success Status Code:** `200 OK`

2. **Get a single book**
   - **Method:** `GET`
   - **Path:** `/books/:id`
   - **Description:** Retrieves details for a specific book by its ID.
   - **Success Status Code:** `200 OK`

3. **Create a book**
   - **Method:** `POST`
   - **Path:** `/books`
   - **Description:** Adds a new book to the library collection.
   - **Request Body Example:**
     ```json
     {
       "title": "The Pragmatic Programmer",
       "author": "Andrew Hunt",
       "publishedYear": 1999
     }
     ```
   - **Success Status Code:** `201 Created`

4. **Update a book**
   - **Method:** `PUT`
   - **Path:** `/books/:id`
   - **Description:** Updates details of an existing book.
   - **Request Body Example:**
     ```json
     {
       "title": "The Pragmatic Programmer (20th Anniversary Edition)",
       "author": "Andrew Hunt",
       "publishedYear": 2019
     }
     ```
   - **Success Status Code:** `200 OK`

5. **Delete a book**
   - **Method:** `DELETE`
   - **Path:** `/books/:id`
   - **Description:** Removes a book from the library catalog.
   - **Success Status Code:** `204 No Content`

6. **List books by an author**
   - **Method:** `GET`
   - **Path:** `/books?author=Andrew%20Hunt`
   - **Description:** Filters the list of books by a specific author using a query parameter.
   - **Success Status Code:** `200 OK`

---

## Error Handling

- **`400 Bad Request`**: Occurs when a client sends invalid data (e.g., trying to `POST` a book without a `title`).
  - *Example Response:* `{"error": "Book title is required."}`
- **`404 Not Found`**: Occurs when requesting a resource (like a specific book ID) that does not exist in the database.
  - *Example Response:* `{"error": "Book with ID 999 not found."}`