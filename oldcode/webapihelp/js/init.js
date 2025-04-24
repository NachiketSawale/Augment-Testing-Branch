/**
 * Created by lst on 13/01/2020.
 */
(function (window) {
	'use strict';

	let globals = window.webAPIConfig;

	console.log('web api help version:', globals.version);

	let newLogoSrc = globals.productLogoUrl;
	if (newLogoSrc) {
		let logoImageElement = document.getElementById('logo');
		let oldLogoSrc = logoImageElement.getAttribute('src');

		if (oldLogoSrc !== newLogoSrc) {
			logoImageElement.setAttribute('src', newLogoSrc);
		}
	}

	let newProductName = globals.productName;
	if (newProductName) {
		let homeLinkElement = document.getElementById('homelink');
		let homeTextElement = document.getElementById('hometext');
		let oldProductName = homeTextElement.textContent;
		if (oldProductName !== newProductName) {
			homeLinkElement.setAttribute('title', newProductName);
			homeTextElement.innerText = newProductName;
		}
	}


	if (!globals.debugMode) {
		let loginContainer = document.getElementById('login-container');
		loginContainer.remove();

		let logoContainer = document.getElementById('logo-container');

		logoContainer.className = logoContainer.className.replace('col-md-3', 'col-md-4');

		let searchContainer = document.getElementById('search-container');
		searchContainer.className = searchContainer.className.replace('col-md-6', 'col-md-8');

		let searchBoxContainer = document.getElementById('searchbox-container');
		searchBoxContainer.className = searchBoxContainer.className.replace('col-md-7', 'col-md-8');

		let searchBtnContainer = document.getElementById('searchbtn-container');
		searchBtnContainer.className = searchBtnContainer.className.replace('col-md-5', 'col-md-4');
	}

})(window);