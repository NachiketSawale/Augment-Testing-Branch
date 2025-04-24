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
	 * @name basicsTextModulesSpecificationService
	 * @function
	 * @description
	 * basicsTextModulesSpecificationService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('basicsTextModulesSpecificationService', ['$http', function ($http) {

		let service = {};
		service.currentSpecificationChanged = new Platform.Messenger();
		let modifiedSpecification = {};
		let currentSpecification = {
			Content: null,
			Id: 0,
			Version: 0
		};

		/**
		 * @ngdoc function
		 * @name getCurrentSpecification
		 * @function
		 * @description This function returns the current specification coming form the currently selected textModules
		 * @returns {Object} returns object representing the current specification
		 */
		service.getCurrentSpecification = function getCurrentSpecification() {
			return currentSpecification;
		};

		service.setCurrentSpecification = function setCurrentSpecification(specification){
			if (currentSpecification !== specification) {
				currentSpecification = specification;
				service.currentSpecificationChanged.fire(specification);
			}
		};

		let clearSpecification = function clearSpecification(){
			currentSpecification.Content = null;
			currentSpecification.Id = 0;
			currentSpecification.Version = 0;
		};

		/**
		 * @ngdoc function
		 * @name loadSpecificationById
		 * @function
		 * @description This function loads the specification given by it's foreign key
		 * @param {Number} fkId Foreign key of the blob string that's to be loaded as specification
		 */
		service.loadSpecificationById = function loadSpecificationById(id) {
			if (id) {
				$http(
					{
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + id
					}
				).then(function (response) {
					// Load successful
					if (response && response.data) {
						currentSpecification = angular.copy(response.data);
						service.currentSpecificationChanged.fire(currentSpecification);
					}
				},
				function (/* error */) {
					// Load failed
					clearSpecification();
				});
			}
			else {
				// invalid specification -> reset specification
				clearSpecification();
				service.currentSpecificationChanged.fire(currentSpecification);
			}
		};

		/**
		 * @ngdoc function
		 * @name setSpecificationAsModified
		 * @function
		 * @description Register the given specification as modified so it'll be saved on text modules selection change.
		 * Do some further checks if saving the changes are really necessary.
		 * @param {Object} specification : modified specification that's to be saved
		 */
		service.setSpecificationAsModified = function setSpecificationAsModified(specification) {

			if (!specification) {
				return;
			}
			modifiedSpecification = specification;
		};

		/**
		 * @ngdoc function
		 * @name getCurrentSpecification
		 * @function
		 * @description This function returns the current specification coming form the currently selected textModule
		 * @returns {Object} returns object representing the current specification
		 */
		service.getCurrentSpecification = function getCurrentSpecification() {
			return currentSpecification;
		};

		service.getModifiedSpecification = function getModifiedSpecification(){
			if(angular.isDefined(modifiedSpecification.Id)){
				return modifiedSpecification;
			}
			else{
				return null;
			}
		};

		service.resetModifiedSpecification = function resetModifiedSpecification(){
			modifiedSpecification = {};
		};

		return service;
	}]);
})();
