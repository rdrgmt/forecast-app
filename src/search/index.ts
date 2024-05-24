
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-bar') as HTMLInputElement;

// handle button click event
searchButton.addEventListener('click', (event) => {
    search(searchInput.value);
    event.preventDefault();
});

function search(searchInput: string) {
    console.log('searching for:', searchInput);
}