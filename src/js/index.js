import countryCardTemplate from '../templates/country-card.hbs';
import countryListTemplate from '../templates/country-list.hbs';
import API from './fetchCountries';
import debounce from 'lodash.debounce';

const refs = {
  inputElt: document.querySelector('.js-input'),
  countryContainerElt: document.querySelector('.country-container'),
};

const debouncedSearch = debounce(onSearch, 1000);

refs.inputElt.addEventListener('input', debouncedSearch);

function onSearch(e) {
  const searchQuery = e.target.value;

  API.fetchCountries(searchQuery)
    .then(renderCountryCard)
    .catch(onError)
    .finally(() => (e.target.value = ''));
}
// console.log(searchQuery);

function renderCountryCard(country) {
  const countryCard = countryCardTemplate(country);
  refs.countryContainerElt.innerHTML = countryCard;
}

function onError(error) {
  alert('shit happens');
}

fetch('https://restcountries.eu/rest/v2/')
  .then(r => r.json)
  .catch(e => console.log(error));
