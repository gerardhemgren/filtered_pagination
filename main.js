 // CREATED (Array: [{item & condition]})
 const itemList = document.getElementById('items-list');
 const pageButton = document.getElementById('page-buttons');
 const itemsNumber = document.getElementById('itemsNumber');
 const intervalNumber = document.getElementById('intervalNumber');

 const array = []; // Array to fill with items;
 const items = Math.floor(Math.random() * 100) + 1;
 const interval = Math.floor(Math.random() * 10) + 15;
 for (i = 0; i < items; i++) {
     const arrayBody = { item: `${(i * Math.floor(Math.random() * 10) + 1)}`, condition: false };
     if (arrayBody.item % 2 == 0) {
         arrayBody.condition = true;
     }
     array.push(arrayBody);
 }
 itemsNumber.innerHTML = items;
 intervalNumber.innerHTML = interval;


 ///////////////////////
 // FilterArray Pares, Inpares, Todos
 let arrayFiltered = array;
 function filter(filterParam) {
     arrayFiltered = array;
     function filterArray() {
         return array.filter(c => {
             if (filterParam == 'even') {
                 return c.condition === true;
             }
             else if (filterParam == 'odd') {
                 return c.condition === false;
             } else if (filterParam == 'all') {
                 return typeof (c.condition == 'boolean')
             }
         })
     }
     arrayFiltered = filterArray();
     sortArray(localStorage.getItem('sort-condition'));
 }

 ///////////////////////
 // SortArray
 localStorage.setItem('sort-condition', undefined);
 function sortArray(sortParam) {
     localStorage.setItem('sort-condition', sortParam);
     const sortInLocalstorage = localStorage.getItem('sort-condition');
     if (sortInLocalstorage != 'unsorted') {
         arrayFiltered.sort(function (a, b) {
             const itemA = a.item;
             const itemB = b.item;
             if (sortInLocalstorage == 'asc') {
                 return itemA - itemB
             } else if (sortInLocalstorage == 'desc') {
                 return itemB - itemA
             }
         })
     }
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
     button.style.marginRight = '4px';
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
     document.getElementById(`page-number-button-1`).classList.add('button-focus');
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