const API_KEY = "df1c5b60-b77e-11e8-a4d1-69890776a30b";

// After page loads query the API for Galleries, then call showGalleries
document.addEventListener("DOMContentLoaded", () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  showGalleries(url);
});

// Function that dsiplays galleries on the screen
function showGalleries(url) {

// Fetch the galleries from API then convert result into JSON while waiting where appropiate
  fetch(url)
  .then(response => response.json())
  .then(data => {
    
    // For each record in the gallery, list id, name, and what floor it is in
    data.records.forEach(gallery => {
      let html_entry = `<li>`;
      
      // Pop up alert and do nothing if gallery entry has nothing inside
      if (gallery.objectcount == 0)
      {
        html_entry += `<a href="#${gallery.id}" onclick="nothing_here()">`
      } else
      {
        // If object count is non-zero then call showObjectsTable
        html_entry +=`<a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">`
      }

      html_entry += `Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})</a></li>`;
        
      document.querySelector("#galleries").innerHTML += html_entry;
    });
    // If more pages are available, show them
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

// Function to show a table of objects for each gallery
function showObjectsTable(id) {
  // When function is called, hide galleries and show all objects of clicked gallery
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";

  // Fetch and jsonify objects of a gallery
  object_url = `https://api.harvardartmuseums.org/object?gallery=${id}&apikey=${API_KEY}`; 
  fetch(object_url)
  .then(response => response.json())
  .then(data => { 
    // Create table from data, adding a row for each object entry
    data.records.forEach(object => {
      let tableHTML = `
      <tr>
        <td> <a href="#${object.objectnumber}" onclick="showDetails(${object.objectnumber})"> ${object.title} </a></td>
        <td>`

        object.people.forEach(person => {
          tableHTML += `<p> ${person.name} </p>`
        });
        
        tableHTML += `</td>
        <td><img src = ${object.primaryimageurl} style="width:96px;height:96px;"></td>
        <td><a href=${object.url}>${object.url}</a></td>
      </tr>`
      // Add the table to the html by seeking id objects
      document.querySelector('#objects').innerHTML += tableHTML;
    });
    
    // Print more pages of objects if available
    if (data.info.next) {
      showObjectsTable(data.info.next);
    }
  })
}

// Function to show details for one object
function showDetails (objectnumber) {
  // When function called, hide objects table and show object detail of pressed object
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#object-details").style.display = "block";

  // Ask the API to provide info for object with a certain object number
  detail_url = `https://api.harvardartmuseums.org/object?objectnumber=${objectnumber}&apikey=${API_KEY}`;
  fetch(detail_url)
  .then(response => response.json())
  .then(data => {
    let item = data.records[0];
    console.log(item);
    //data.records.forEach(item => {
      let description = `
      <h2> ${item.title}</h2>
      <img src = ${item.primaryimageurl} style="width:384x;height:384px;">
      <p> <strong> Accession: </strong> ${item.accessionyear}</p>
      <p> <strong> Provenance: </strong> ${item.provenance}</p>
      <p> <strong> Descripton: </strong> ${item.description}</p>ß
      `
      document.querySelector("#object-details").innerHTML += description;


    });
}

function nothing_here() {
  alert("No content");
}

function goBack() {
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#object-details").style.display = "none";
}
