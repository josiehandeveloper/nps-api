'use strict';

const apiKey = '7ld6irAieAJcXtgpy5Hu7S5bPeLrEm5zP0hyTKhb';
const searchURL = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  // it gets passed an arbitrary object of query parameters and iterates over the keys in the object
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    //uses built-in js function encodeURIComponent which converts strings to URL safe formats by escaping characters like spaces to %20
  return queryItems.join('&');
}

function displayResults(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  //iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <li><a href="${responseJson.data[i].url}">Visit the Park's Website</a>
      </li>`
    )};
  //display the results section
  $('.results');
};

//GET Request to National Park api
function getNationalParks(query, stateArr, maxResults, apiKey) {
  const params = {
    stateCode: stateArr,
    limit: maxResults
  
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString + '&api_key=' + apiKey;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateArr = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getNationalParks(searchURL, stateArr, maxResults, apiKey);
  })
}

$(watchForm);