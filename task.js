const library = [

];



//Helper Functions--------------------------------------------------------------------------------------------------------
 function generateId() {
            return library.length > 0 ? library[library.length - 1].id + 1 : 1;
        }



function isOverdue(dueDate){
    const today= new Date();
    if(today>new Date(dueDate)){
        return true;
    }
    return false;
} 


function getDaysOverdue(dueDate) {
      const today=new Date();
      const daysOverdue = Math.floor((today - new Date(dueDate)) / (1000 * 60 * 60 * 24));
      return daysOverdue;
}


 function formatBookInfo(book) {
    const formattedBookInfo=`
    <div><h3>ID:</h3> ${book.id}</div>
     <div><h3>Title:</h3> ${book.title}</div>
     <div><h3>Author:</h3> ${book.author}</div>
     <div><h3>Year:</h3> ${book.year}</div>
     <div><h3> ${book.available?"<font style='color: #4CAF50'>Available</font>":"<font style='color: #f44336'>Borrowed</font>"}</h3></div>
    ${book.dueDate ? `Due: ${new Date(book.dueDate).toLocaleDateString()} ${isOverdue(book.dueDate) ? '(Overdue by: '+getDaysOverdue(book.dueDate)+' days) - Overdue fee: $'+getDaysOverdue(book.dueDate) : ''}` : ''}</div>
    `;

    return formattedBookInfo;
 }



function createBookElement(book){
     const bookDiv = document.createElement('div');
    bookDiv.className = `book-item ${book.available ? 'available' : 'borrowed'}`;
    bookDiv.innerHTML=`
     <div class="book-info">
     ${formatBookInfo(book)}
    </div>
    <hr>
    <div class=".book-actions">
    <div class="book-actions" id="actions-${book.id}">
    ${book.available ?
    `<button onclick="quickBorrow(${book.id})">Borrow</button>` :
    `<button onclick="quickReturn(${book.id})">Return</button>`
    }
    ${book.available ? `<button onclick="quickRemove(${book.id})">Remove</button>` : ''}
    </div>
    `;

    

const bookElement=bookDiv;

    return bookElement;
}



function updateBookDisplay(){
    displayAllBooks();
}


function showStatus(message){
    const statusDiv=document.getElementById('status-message');

    statusDiv.textContent = message;
            statusDiv.className = `status ${message.includes("!") ? 'error' : 'success'}`;
            setTimeout(() => {
                statusDiv.textContent = '';
                statusDiv.className = 'status';
            }, 5000);
}


//Core Functions--------------------------------------------------------------------------------------------------------
function displayAllBooks(){
    const booksDisplayDiv=document.getElementById('books-display');
    booksDisplayDiv.innerHTML="";
    for (const book of library) {
        booksDisplayDiv.appendChild(createBookElement(book));  
    }
}



function displaySearchResults(results) {
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = '';

            if (results.length === 0) {
                searchResults.innerHTML = '<p>No books found.</p>';
                return;
            }

            for (let i=0;i<results.length;i++){
                const book=results[i];
                const bookElement = createBookElement(book);
                searchResults.appendChild(bookElement);
            }
}


function addBook(title, author, year){
isValid=true;
if(!title || !author || !year){
isValid=false;
}else if(!isNaN(title) || !isNaN(author)){
    return "Please enter valid info!"
}
else{
    const book={
        id: generateId(), 
        title: title, 
        author: author, 
        year: year,
        available: true,
        borrower: "",
        dueDate: "",
        isOverdue:isOverdue,
        daysOverdue:isOverdue?getDaysOverdue:0
    }

    library.push(book);

    displayAllBooks();
}

return isValid?"Book added successfully.":"Please fill in all fields!";
}



function removeBook(bookId){

     if (isNaN(bookId) || Number(bookId) <= 0) {
            return "Please enter a valid book ID!";
            }
            
           
        for (let i=0;i<library.length;i++) {
            if(library[i].id === bookId){
                found=true;
                 if(!library[i].available){
                return "Book is currently borrowed!"
            }
            else{
                library.splice(i,1);
                displayAllBooks();
                return  "Book removed successfully.";
            }
        } 
    }
if(!found){
    return "Book was not found!";
}
}


function searchBooks(query){
    let results=[];

    for (let i = 0; i < library.length; i++) {
                    if (library[i].title.toLowerCase().includes(query.toLowerCase()) || library[i].author.toLowerCase().includes(query.toLowerCase())) {
                        results.push(library[i]);
                    }
                }

                return results;
}


function borrowBook(bookId, borrowerName){
     let found = false;
         if (isNaN(bookId) || Number(bookId) <= 0) {
            return "Please enter a valid book ID!";
            }

              if (borrowerName==="" || !isNaN(borrowerName)) {
            return "Please enter a valid borrower name!";
            }

            for (let i=0;i<library.length;i++) {
                 if(library[i].id===Number(bookId) ){
                    found=true;
                    if(!library[i].available){
                        return "Book is currently borrowed!";
                    }
                    
                    library[i].available=false;
                    library[i].borrower=borrowerName;
                    library[i].dueDate= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
                    displayAllBooks();
                    return "Book borrowed successfully.";
                 } 
                
            }
            if(found==false){
                return "Book is not found!"; 
            }

}




function returnBook(bookId){
        isFound=false;

     if (isNaN(bookId) || Number(bookId) <= 0) {
            return "Please enter a valid book ID!";
            }
            
           
        for (let i=0;i<library.length;i++) {
            if(library[i].id === bookId){
                isFound=true;
                 if(library[i].available){
                return "Book is already available!"
            }
            else{
                library[i].available=true;
                library[i].borrower="";
                library[i].dueDate="";
                displayAllBooks();
                return  "Book returned successfully.";
            }
        } 
    }
if(! isFound){
    return "Book was not found!";
}
}




//Event Handlers--------------------------------------------------------------------------------------------------------

function handleAddBook(){
    const title=document.getElementById("add-title").value;
    const author=document.getElementById("add-author").value;
    const year=document.getElementById("add-year").value;
    showStatus(addBook(title,author,Number(year)));
   
    document.getElementById('add-title').value = '';
    document.getElementById('add-author').value = '';
    document.getElementById('add-year').value = '';
}




function handleRemoveBook(){
const bookId=document.getElementById("remove-id").value;
    showStatus(removeBook(Number(bookId)));

    document.getElementById('remove-id').value = '';
}



function handleSearchBooks(){
    const query=document.getElementById("search-query").value;
   const results = searchBooks(query);
    displaySearchResults(results);
    document.getElementById('search-query').value = '';
}




function handleBorrowBook(){
    const bookId=document.getElementById("borrow-id").value;
    const borrowerName=document.getElementById("borrower-name").value;
    showStatus(borrowBook(Number(bookId),borrowerName));
    document.getElementById('borrow-id').value = '';
    document.getElementById('borrower-name').value = '';
}




function handleReturnBook(){
    const bookId=document.getElementById("return-id").value;
    showStatus(returnBook(Number(bookId)));
    document.getElementById('return-id').value = '';
}


//Quick Actions--------------------------------------------------------------------------------------------------------

 function quickBorrow(bookId){
    const actionsDiv = document.getElementById(`actions-${bookId}`);

    actionsDiv.innerHTML = `
        <input type="text" id="quick-name-${bookId}" placeholder="Your name">
        <button onclick="confirmQuickBorrow(${bookId})">Confirm</button>
    `;
}


function confirmQuickBorrow(bookId) {
    const input = document.getElementById(`quick-name-${bookId}`);
    const borrowerName = input.value;
    if (!borrowerName) {
        showStatus("Please enter borrower name!");
        return;
    }
    
    showStatus(borrowBook(bookId, borrowerName));

    displayAllBooks();
}


 function quickReturn(bookId){
        showStatus(returnBook(bookId));
        displayAllBooks();
 }



 function quickRemove(bookId){
showStatus(removeBook(bookId));
                displayAllBooks();
 }


//Runner function--------------------------------------------------------------------------------------------------------
function main() {
        displayAllBooks();
            document.getElementById('add-book-btn').addEventListener('click', handleAddBook);
            document.getElementById('remove-book-btn').addEventListener('click', handleRemoveBook);
            document.getElementById('search-books-btn').addEventListener('click', handleSearchBooks);
            document.getElementById('borrow-book-btn').addEventListener('click', handleBorrowBook);
            document.getElementById('return-book-btn').addEventListener('click', handleReturnBook);
            document.getElementById('display-all-btn').addEventListener('click', displayAllBooks);
        }


main();

