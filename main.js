// CREATED (Array: [{item & condition]})
const itemList = document.getElementById('items-list');
const pageButton = document.getElementById('page-buttons');
const itemsNumber = document.getElementById('itemsNumber');
const intervalNumber = document.getElementById('intervalNumber');

const array = []; // Array to fill with items;
const items = Math.floor(Math.random() * 100);
const interval = Math.floor(Math.random() * 10) + 15;
itemsNumber.innerHTML = items;
intervalNumber.innerHTML = interval;
for (i = 0; i < items; i++) {
    const arrayBody = { item: `${(i * Math.floor(Math.random() * 10) + 1)}`, condition: false };
    if (arrayBody.item % 2 == 0) {
        arrayBody.condition = true;
    }
    array.push(arrayBody);
}
array.shift() // removes the first element that's always 1


///////////////////////
// Filter & Sort with reset
let arrayFiltered = array;
localStorage.setItem('filter-condition', 'reset');
localStorage.setItem('sort-condition', 'reset');
let filterInLocalStorage;
let sortInLocalStorage;
function filterAndSort(filter, sort) {
    arrayFiltered = array;
    sort !== '' ? localStorage.setItem('sort-condition', sort) : 'reset';
    filter !== '' ? localStorage.setItem('filter-condition', filter) : 'reset';

    function filterArray() {
        filterInLocalStorage = localStorage.getItem('filter-condition');
        return arrayFiltered.filter(c => {
            if (filterInLocalStorage == 'even') {
                return c.condition === true;
            }
            else if (filterInLocalStorage == 'odd') {
                return c.condition === false;
            } else if (filterInLocalStorage == 'reset') {
                return typeof (c.condition == 'boolean');
            }
        })
    }

    function sortArray() {
        sortInLocalStorage = localStorage.getItem('sort-condition');
        if (sortInLocalStorage !== 'reset') {
            return arrayFiltered.sort(function (a, b) {
                if (sortInLocalStorage == 'asc') {
                    return a.item - b.item;
                } else if (sortInLocalStorage == 'desc') {
                    return b.item - a.item;
                }
            })
        } else {
            return arrayFiltered;
        }
    }

    arrayFiltered = filterArray();
    arrayFiltered = sortArray();
    pageButton.innerHTML = ''; // refresh buttons
    splitInPages();
    renderItems();
}

///////////////////////
// PageSplit
let arrayFilteredInPages = [];
function splitInPages() {
    // refresh
    let pageSplit = Math.ceil(arrayFiltered.length / interval);
    arrayFilteredInPages = [];
    firstPoint = 0;
    lastPoint = interval;
    pageButton.innerHTML = '';
    //////////
    for (let pageN = 0; pageN < pageSplit; pageN++) {
        let pageBody = { pageNumber: (pageN + 1), items: [] };
        arrayFilteredInPages.push(pageBody);
        for (; firstPoint < lastPoint; firstPoint++) {
            if (firstPoint == arrayFiltered.length) { break; }
            const itemBody = { item: '', condition: '' };
            itemBody.item = arrayFiltered[firstPoint].item;
            itemBody.condition = arrayFiltered[firstPoint].condition;
            pageBody.items.push(itemBody);
        }
        lastPoint += interval;
        createButton(arrayFilteredInPages[pageN].pageNumber);
    }
}
splitInPages();

///////////////////////
// Creates Buttons
function createButton(pageNumber) {
    const button = document.createElement('button');
    button.style.margin = '0px 4px 8px 2px';
    button.innerHTML = pageNumber;
    button.setAttribute('id', `page-number-button-${pageNumber}`);
    button.addEventListener('click', function () {
        renderItems(pageNumber);
        /// ButtonPages Focus
        for (b = 0; b < document.getElementById(`page-buttons`).children.length; b++) {
            document.getElementById(`page-buttons`).children[b].classList.remove('button-focus');
        }
        document.getElementById(`page-number-button-${pageNumber}`).classList.add('button-focus');
    })
    pageButton.appendChild(button);
}

///////////////////////
// Renders Items
function renderItems(pageNumber) {
    if (!pageNumber) {
        renderPageNumber = 1;
    } else {
        renderPageNumber = pageNumber;
    }
    itemList.innerHTML = '';
    let currentPage;
    if (arrayFilteredInPages.length != 0) {
        currentPage = arrayFilteredInPages[renderPageNumber - 1].items;
        for (i in currentPage) {
            const eachItem = document.createElement('div');
            eachItem.innerHTML = currentPage[i].item;
            itemList.appendChild(eachItem);
            eachItem.setAttribute('id', i);
        }
    }
    document.getElementById(`page-number-button-1`) ? document.getElementById(`page-number-button-1`).classList.add('button-focus') : null;
}
renderItems();

/////////////////////
// Focus category buttons ONLY
function setButtonClass() {
    allButtons = document.getElementsByTagName('button');
    for (i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', function setFocus(self) {
            delFocusClass(self);
            self.path[0].classList.add('button-focus');
        })
    }
}
setButtonClass();
function delFocusClass(self) {
    siblingElements = self.path[1].children
    for (i = 0; i < siblingElements.length; i++) {
        siblingElements[i].classList.remove('button-focus');
    }
}

// Shows & Hides reset button
function hideResetBtn(btn) {
    document.getElementsByName(btn + '-btn')[0].style.visibility = 'hidden';
    // if (btn === 'filter' && sortInLocalStorage !== undefined) { // reset as undefined
    //     localStorage.setItem('sort-condition', 'reset');
    //     hideResetBtn('sort');
    //     for (i in document.getElementById('sortPanel').children) {
    //         console.log(document.getElementById('sortPanel').children[i])
    //         document.getElementById('sortPanel').children[i].classList.remove('button-focus');
    //     }
    // }
}
hideResetBtn('filter');
hideResetBtn('sort');

function showResetBtn(btn) {
    document.getElementsByName(btn + '-btn')[0].style.visibility = 'visible';
}
