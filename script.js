function createMyElement(tag, value="", classes="", id="") {
  var element = document.createElement(tag);
  if(value!="")
    element.innerHTML = value;
  if(classes!="")
    element.setAttribute('class', classes);
  if(id!="")
    element.setAttribute('id', id);
  return element;
}

// var dogFactsUrl = "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs/all";
// fetch(dogFactsUrl, 
//   {
//     method: 'GET',
//     redirect: 'follow',
//     mode: "no-cors"
//   })
// .then(response => { 
//   console.log(response, response.text());
//   return response.text();
// })
// the above response is of type 'opaque' and cannot be accessed using frontend javascript
//therefore I copied the response data from POSTMAN to dogFacts.json file

const numOfFactsOnPage = 4;
var currPage = 1;
var numOfFacts;
var numOfPages;
var images = [];
var imgURL = "https://random.dog/woof.json";
fetch("dogFacts.json")
  .then(response => { 
    // console.log(response);
    return response.json();
  })
  .then(result => {
    console.log(result);
    numOfFacts = result.length;
    numOfPages = Math.ceil(numOfFacts / numOfFactsOnPage);
    console.log(numOfFacts, numOfPages);
    for(var i=0; i < numOfPages; i++){
      var page = createMyElement('div', '', 'myPage', 'page'+(i+1));
      page.style.zIndex = numOfPages-i;
      var front = createMyElement('div', '', 'face front p-2', 'front'+(i+1));
      var back = createMyElement('div', '', 'face back p-2', 'back'+(i+1));

      for(var j=0; j<numOfFactsOnPage; j++) {
        var k = (numOfFactsOnPage*i)+j;
        if(k<numOfFacts)
        var p = createMyElement('p', result[k].fact);
        front.append(p);
      }
      page.append(front, back);
      var myContainer = document.querySelector('.flip-container');
      myContainer.append(page);      
    }
    for(var i = 1; i<numOfPages; i++) {
      fetch(imgURL)
      .then((response) => { 
        return response.json();
      })
      .then((result) => {
        var dogImg = result.url;
        images.push(dogImg);
        addPicture();
      })
      .catch((err) => { console.log(err); });
    }
  })
  .catch((err) => { console.log(err); });
  
var picCount = 0;
function addPicture() {
  picCount += 1;
  if(picCount<numOfPages) {
    // console.log(images);
    var pageBack = document.getElementById('back'+picCount);
    var img = createMyElement('img', '', 'img-fluid rounded mx-auto');
    img.src = images[picCount-1];
    pageBack.append(img);
  }
}

var windowGT900px = window.matchMedia("(min-width: 900px)");

function NextPage() {
  if(windowGT900px.matches){
    if(currPage+1 <= numOfPages) {
      var page = document.querySelector('#page'+currPage);
      page.style.transform = "rotateY(-180deg)";
      setTimeout(() => {
        page.style.zIndex = currPage;
        currPage++;
      }, 600);
    }
  }
  else {
    if(currPage+1 <= numOfPages) {
      var page = document.querySelector('#page'+currPage);
      page.style.transform = "translateX(-200%)";
        currPage++;
    }
  }
}

function PrevPage() {
  if(windowGT900px.matches){
    if(currPage-1 > 0) {
      currPage--;
      var page = document.querySelector('#page'+currPage);
      page.style.zIndex = numOfPages - currPage + 1;
      setTimeout(() => {
        page.style.transform = "rotateY(0deg)";
      }, 800);
    }
  }
  else {
    if(currPage-1 > 0) {
      currPage--;
      var page = document.querySelector('#page'+currPage);
      page.style.transform = "translateX(0%)";
    }
  }
}