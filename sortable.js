// we have built a webpage which fetches an api that contains an information on superheros. Describing different type of qualities and powers

let data, table, sortCol;
//The Promise returned from fetch() won't reject on HTTP error status even if the response is an HTTP 404 or 500. 
//Instead, as soon as the server responds with headers, the Promise will resolve normally
//the fetch() method is used to make asynchronous requests to the server and load the information that is returned by the server onto the web pages.
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((data) => {
    //console.log(data);  //json format
    return data.json(); //  converted to object
  })
  .then((objectData) => {
    data = objectData;
    renderT();
  })
  .catch((err) => {
    console.log(err);
  });

//Need to fire the HTML up
document.addEventListener("DOMContentLoaded", init, false);
document.getElementById("page-view").onchange = changePageSize;
//an event Listener, when the value is changed in the drop down, 
//it calls the function change Page Size. and then change page size updates the variable
//and re renders the table.

// making a connection through HTML & JS and then target async function by id
let sortAsc = false;
async function init() {
  //thats all the column headers
  //targets the html tag by id
  let tableHead = document.getElementById("tableHead");
  //thats all the column headers
  //you iterate through all of them

  Array.from(tableHead.children).forEach((th) => { // we use children because what ever is in array we want to access
    // and assign them the eventListener which uses on click, sort function, and sets ascending to default
    th.addEventListener("click", sort, false);
  });
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#parameters

}

//using let thisSort allows you to use dataset.sort to access data sort values from the html 
//so thisSort, is whatever the data-sort value is for the column you clicked on
function sort(e) {
  let thisSort = e.target.dataset.sort; // an event listener which targets the data set & sorts it
  if (sortCol === thisSort) sortAsc = !sortAsc; // if the col already being sorted is the same as you clicked on
  sortCol = thisSort;


  // 1 highest, -1 lowest & 0 equal
  // passing to parameters in order to compare which values are highest or lowest
  data.sort((a, b) => {
    let aVal, bVal;
    let property = sortCol.split(".");
    if (property.length > 1) {
      aVal = a[property[0]][property[1]];
      bVal = b[property[0]][property[1]];
    } else {
      aVal = a[sortCol]; // will arrive as one with no spilt
      bVal = b[sortCol];
    }
    if (sortCol === "appearance.weight") {

      // change string into and integer then comparing 1 & -1 
      if (parseInt(aVal[0].split(" ")[0]) < parseInt(bVal[0].split(" ")[0])) return sortAsc ? 1 : -1;
      if (parseInt(aVal[0].split(" ")[0]) > parseInt(bVal[0].split(" ")[0])) return sortAsc ? -1 : 1;
    }

    if (sortCol === "appearance.height") {
      if (parseInt(aVal[0]) < parseInt(bVal[0])) return sortAsc ? 1 : -1;
      if (parseInt(aVal[0]) > parseInt(bVal[0])) return sortAsc ? -1 : 1;
    }
    //Missing values should always be sorted last, irrespective of ascending or descending. 
    //Null and Undefined Values Sorted to the bottom
    if (aVal === "" || aVal === null || aVal === "-" || aVal === "(Galan) Taa; (Galactus) the Cosmic Egg") {
      return 1;
    }
    if (bVal === "" || bVal === null || bVal === "-" || bVal === "(Galan) Taa; (Galactus) the Cosmic Egg") {
      return -1;
    }
    if (aVal[0] === "Shaker Heights, Ohio" || aVal[0] === "-") {
      return 1;
    }
    if (bVal[0] === "Shaker Heights, Ohio" || bVal[0] === "-") {
      return -1;
    }
    if (aVal[0] === "- lb" || aVal === "Shaker Heights, Ohio") {
      return 1;
    }
    if (bVal[0] === "- lb" || bVal === "Shaker Heights, Ohio") {
      return -1;
    }


    if (aVal < bVal) return sortAsc ? 1 : -1;
    if (aVal > bVal) return sortAsc ? -1 : 1;

    if (aVal[0] < bVal[0]) return sortAsc ? 1 : -1;
    if (aVal[0] > bVal[0]) return sortAsc ? -1 : 1;

    return 0;
  });
  renderT();
}

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table_body");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  //Initially all rows should be sorted by the column name by ascending order
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

let pageSize = 20;
let curPage = 1;

// querySelector returns the first Element within the document that matches the specified selector
document
  .querySelector("#nextButton")
  .addEventListener("click", nextPage, false);
document
  .querySelector("#prevButton")
  .addEventListener("click", previousPage, false);

function previousPage() {
  if (curPage > 1) curPage--;
  renderT();
}

function nextPage() {
  if (curPage * pageSize < data.length) curPage++;
  renderT();
}

function changePageSize() {
  pageSize = document.getElementById("page-view").value;
  curPage = 1;
  renderT();
}

function renderT() {
  // create html
  //we want to get an index of filtered values. the data is looped and displays the data in the tablesheet.
  // Filter array of arrays by row 
  //
  let result = "";
  data
    .filter((row, index) => {
      let start = (curPage - 1) * pageSize;
      let end = curPage * pageSize;
      if (index >= start && index < end) return true;
    })
    .forEach((values) => {
      result += `<tr>
      <td><div class="hero"><img src="${values.images.md}"/></div></td>
      <td>${values.name}</td>
      <td>${values.biography.fullName}</td>
      <td>${values.powerstats.combat}</td>
      <td>${values.powerstats.durability}</td>
      <td>${values.powerstats.intelligence}</td>
      <td>${values.powerstats.power}</td>
      <td>${values.powerstats.speed}</td>
      <td>${values.powerstats.strength}</td>
      <td>${values.appearance.race}</td>
      <td>${values.appearance.gender}</td>
      <td>${values.appearance.height[0]} ft</td>
      <td>${values.appearance.weight[0]}</td>
      <td>${values.biography.placeOfBirth}</td>
      <td>${values.biography.alignment}</td>
    </tr>`;
    });
  document.getElementById("table_body").innerHTML = result;
}
//we iterate through all the tds and set their event listeners.