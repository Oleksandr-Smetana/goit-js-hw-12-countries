import countryCardTemplate from '../templates/country-card.hbs';
import countryListTemplate from '../templates/country-list.hbs';
import API from './fetchCountries';
import debounce from 'lodash.debounce';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { notice, error } from '@pnotify/core';

const refs = {
  inputElt: document.querySelector('.js-input'),
  countryContainerElt: document.querySelector('.country-container'),
};

const debouncedSearch = debounce(onSearch, 500);

refs.inputElt.addEventListener('input', debouncedSearch);

function onSearch(e) {
  const searchQuery = e.target.value;

  API.fetchCountries(searchQuery)
    .then(countries => {
      //   console.log(countries);
      if (countries.length === 1) {
        renderCountryCard(countries);
      }
      if (countries.length > 1 && countries.length < 11) {
        renderCountryList(countries);
      }
      if (countries.length > 10) {
        refs.countryContainerElt.innerHTML = '';
        notice({
          text: `We found ${countries.length} countries. Please enter a more specific query!`,
          delay: 4000,
        });
      }
      // when the country name is entered incorrectly
      if (countries.status === 404) {
        refs.countryContainerElt.innerHTML = '';
        onError();
      }
    })
    .catch(onError)
    .finally(() => (e.target.value = ''));
}

function renderCountryCard(country) {
  const countryCard = countryCardTemplate(country);
  refs.countryContainerElt.innerHTML = countryCard;
}

function renderCountryList(countries) {
  const countryNames = countries.map(country => {
    return country.name;
  });
  const countriesResult = countryListTemplate(countryNames);
  //   console.log(countriesResult);
  refs.countryContainerElt.innerHTML = countriesResult;
}

function onError() {
  error({
    text: 'There no such country. Try again!',
    delay: 40000,
  });
}
