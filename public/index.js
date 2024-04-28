document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/getAllBooks');
    console.log("getallbooks index.js response:"+response);
    if (response.ok) {
      const bookListDiv = document.getElementById('bookList');
      const books = await response.json();
      books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-info');
        bookDiv.setAttribute('data-book-id', book.id);
        bookDiv.innerHTML = `<strong>Book Name:</strong> ${book.name} <br>
                              <strong>Taken on:</strong> ${book.taken_on} <br>
                              <strong>Return date:</strong> ${book.return_date} <br>
                              <strong>Fine charged:</strong> Rs. ${book.fine_charged}`;
        const returnButton = document.createElement('button');
        returnButton.textContent = 'Return';
        returnButton.addEventListener('click', async () => {
          const bookId = bookDiv.getAttribute('data-book-id');
          const returnResponse = await fetch(`/returnBook/${bookId}`, {
            method: 'POST',
          });
          if (returnResponse.ok) {
            bookListDiv.removeChild(bookDiv);
          }
        });
        bookDiv.appendChild(returnButton);
        bookListDiv.appendChild(bookDiv);
      });
    }
  });
  



document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookName = document.getElementById('bookName').value;
    const response = await fetch('/addBook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `bookName=${encodeURIComponent(bookName)}`,
    });
    console.log("response of addbookform index.js:"+ response);
    if (response.ok) {
      const bookListDiv = document.getElementById('bookList');
      const bookData = await response.json(); // Parse the JSON response
      const bookDiv = document.createElement('div');
      bookDiv.classList.add('book-info');
      const takenOn = new Date().toISOString().slice(0, 10);
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14); // Assuming a 14-day return period
      const fineCharged = 0; // Assuming no fine initially
      
      bookDiv.setAttribute('data-book-id', bookData.id); // Using the correct id from the response
      bookDiv.innerHTML = `<strong>Book Name:</strong> ${bookName} <br>
                            <strong>Taken on:</strong> ${takenOn} <br>
                            <strong>Return date:</strong> ${returnDate.toISOString().slice(0, 10)} <br>
                            <strong>Fine charged:</strong> Rs. ${fineCharged}`;
      const returnButton = document.createElement('button');
      returnButton.textContent = 'Return';
      returnButton.addEventListener('click', async () => {
        const bookId = bookDiv.getAttribute('data-book-id');
        const returnResponse = await fetch(`/returnBook/${bookId}`, {
          method: 'POST',
        });
        if (returnResponse.ok) {
          bookListDiv.removeChild(bookDiv);
        }
      });
      bookDiv.appendChild(returnButton);
      bookListDiv.appendChild(bookDiv);
    }
  });
