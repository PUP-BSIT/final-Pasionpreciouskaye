document.addEventListener('DOMContentLoaded', function () {
  const commentForm = document.getElementById('comment');
  const commentsList = document.getElementById('comments_list');
  const sortAscButton = document.getElementById('sort_asc');
  const sortDescButton = document.getElementById('sort_desc');
  const nameInput = document.getElementById('name');
  const commentInput = document.getElementById('ycomment');
  const submitButton = document.getElementById('button_comment');

  commentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addComment();
  });

  sortAscButton.addEventListener('click', function () {
    sortComments('asc');
  });

  sortDescButton.addEventListener('click', function () {
    sortComments('desc');
  });

  nameInput.addEventListener('input', checkFormValidity);
  commentInput.addEventListener('input', checkFormValidity);

  function checkFormValidity() {
    if (nameInput.value.trim() !== '' && commentInput.value.trim() !== '') {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  function addComment() {
    const name = nameInput.value;
    const commentText = commentInput.value;
    const timestamp = new Date().toISOString();
    const commentHTML = `<li data-timestamp="${timestamp}">${commentText} 
                    - ${name} <span class="date">${timestamp}</span></li>`;

    commentsList.insertAdjacentHTML('beforeend', commentHTML);
    nameInput.value = '';
    commentInput.value = '';
    submitButton.disabled = true; 
  }

  function sortComments(order) {
    const commentsArray = Array.from(commentsList.querySelectorAll('li'));

    commentsArray.sort((a, b) => {
      const dateA = new Date(a.getAttribute('data-timestamp'));
      const dateB = new Date(b.getAttribute('data-timestamp'));
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    commentsList.innerHTML = '';
    commentsArray.forEach(comment => {
      commentsList.appendChild(comment);
    });
  }
});

function searchCountry() {
  let countryName = document.getElementById('country_Input').value.trim();
  if (!countryName) {
    document.getElementById('country_details').innerHTML =
       '<p>Please enter a country name.</p>';
    document.getElementById('same_regioncountries').innerHTML = '';
    return;
  }

  fetch('https://restcountries.com/v3.1/name/' + countryName)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Country not found');
      }
      return response.json();
    })
    .then(function(countryData) {
      let country = countryData[0];
      let details = `<h2>Country Details - ${country.name.common}</h2>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
      <p><strong>Area:</strong> 
        ${country.area ? country.area.toLocaleString()
           + ' square kilometers' : 'N/A'}
      </p>
      <p><strong>Languages:</strong> 
        ${country.languages ? Object.values(country.languages)
          .join(', ') : 'N/A'}
      </p>
      <p><strong>Subregion:</strong>
        ${country.subregion ? country.subregion : 'N/A'}
      </p>
      <p><strong>Capital:</strong>
        ${country.capital ? country.capital[0] : 'N/A'}
       </p>
      <p><strong>Timezones:</strong> 
        ${country.timezones ? country.timezones.join(', ') : 'N/A'}
      </p>
`;
      document.getElementById('countryDetails').innerHTML = details;

      return fetch('https://restcountries.com/v3.1/region/' + country.region);
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Region not found');
      }
      return response.json();
    })
    .then(function(regionData) {
      let region = regionData[0].region;
      let sameRegionCountriesList = regionData.map(function(c) {
        return `
         <div style="display: inline-block; margin: 10px; text-align: center;">
          <img src="${c.flags.svg}" alt="Flag of ${c.name.common}">
            <p>${c.name.common}</p>
          </div>
        `;
      }).join('');
      document.getElementById('sameRegionCountries').innerHTML = `
        <h2>Countries in the Same Region (${region})</h2>
        <div>${sameRegionCountriesList}</div>
      `;
    })
    .catch(function(error) {
      console.error('Error fetching data:', error);
      document.getElementById('countryDetails').innerHTML = 
        '<p>An error occurred: ' + error.message + '</p>';
      document.getElementById('sameRegionCountries').innerHTML = '';
    });
}
