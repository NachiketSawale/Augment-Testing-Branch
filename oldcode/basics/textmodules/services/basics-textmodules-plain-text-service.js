/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, Platform */
	'use strict';
	let moduleName = 'basics.textmodules';

	/**
	 * @ngdoc service
	 * @name basicsTextModulesPlainTextService
	 * @function
	 * @description
	 * basicsTextModulesPlainTextService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('basicsTextModulesPlainTextService', ['$http', function ($http) {

		let service = {};
		service.currentPlainTextChanged = new Platform.Messenger();

		let modifiedPlainText = {},
			currentPlainText = {
				Content: null,
				Id: 0,
				Version: 0
			};

		/**
		 * @ngdoc function
		 * @name loadPlainTextById
		 * @function
		 * @description This function loads the specificationPlain given by it's foreign key
		 * @param {Number} fkId Foreign key of the clob string that's to be loaded as PlainText
		 */
		service.loadPlainTextById = function loadPlainTextById(fkId) {
			if (fkId) {

				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + fkId
					}
				).then(function (response) {
					// Load successful
					if (response && response.data) {
						currentPlainText = angular.copy(response.data);
						service.currentPlainTextChanged.fire(currentPlainText);
					}
				},
				function (/* response */) {
					// Load failed
					clearPlainText();
				});
			}
			else {
				// invalid plain text -> reset plain text
				clearPlainText();
				service.currentPlainTextChanged.fire(currentPlainText);
			}
		};

		/**
		 * @ngdoc function
		 * @name setCurrentPlainText
		 * @function
		 * @description This function sets the current plain text.
		 * @param {Object} specificationPlain to be set as currentPlainText
		 */
		service.setCurrentPlainText = function setCurrentPlainText(plainText) {
			if (currentPlainText !== plainText) {
				currentPlainText= plainText;
				service.currentPlainTextChanged.fire(currentPlainText);
			}
		};

		/**
		 * @ngdoc function
		 * @name getCurrentPlainText
		 * @function
		 * @description This function returns the current specification coming form the currently selected textModule
		 * @returns {Object} returns object representing the current plain text
		 */
		service.getCurrentPlainText = function getCurrentPlainText() {
			return currentPlainText;
		};

		/**
		 * @ngdoc function
		 * @name setPlaintextAsModified
		 * @function
		 * @description Register the given plainText as modified so it'll be saved on  text modules selection change.
		 * Do some further checks if saving the changes are really necessary.
		 * @param {Object} specificationPlain modified plain text that's to be saved
		 */
		service.setPlaintextAsModified = function setPlaintextAsModified(plainText) {
			if (!plainText) {
				return;
			}
			modifiedPlainText = plainText;
		};

		let clearPlainText = function clearPlainText(){
			currentPlainText.Content = null;
			currentPlainText.Id = 0;
			currentPlainText.Version = 0;
		};

		service.getModifiedPlainText = function getModifiedPlainText(){
			if(angular.isDefined(modifiedPlainText.Id)){
				return modifiedPlainText;
			}
			else{
				return null;
			}
		};

		service.resetModifiedPlainText = function resetModifiedPlainText(){
			modifiedPlainText = {};
		};

		return service;
	}]);
})();
