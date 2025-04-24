/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectSpecificationService
	 * @function
	 * @description
	 * basicsTextModulesSpecificationService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('estimateProjectSpecificationService', ['$http','$injector',
		function ($http, $injector) {

			let service = {};
			service.currentSpecificationChanged = new Platform.Messenger();

			let modifiedSpecifications = [];
			let currentSpecification = {
				Content: null,
				ParentId: null,
				Id: 0,
				Version: 0
			};

			/**
		 * @ngdoc function
		 * @name getCurrentSpecification
		 * @function
		 * @description This function returns the current specification coming form the currently selected header
		 * @returns {Object} returns object representing the current specification
		 */
			service.getCurrentSpecification = function getCurrentSpecification() {
				return currentSpecification;
			};

			service.setCurrentSpecification = function setCurrentSpecification(specification){
				if (currentSpecification !== specification) {
					currentSpecification = specification || {};
					service.currentSpecificationChanged.fire(specification);
				}
			};

			service.clearSpecification = function clearSpecification(){
				if(!currentSpecification){
					return;
				}
				currentSpecification.Content = null;
				currentSpecification.ParentId = null;
				currentSpecification.CompositeItemId = null;
				currentSpecification.Id = 0;
				currentSpecification.Version = 0;
			};

			/**
		 * @ngdoc function
		 * @name loadSpecification
		 * @function
		 * @description This function loads the specification given by it's foreign key
		 * @param {Number} fkId Foreign key of the blob string that's to be loaded as specification
		 */
			service.loadSpecification = function loadSpecification(item, compositeItemId) {
				if(!item){
					service.clearSpecification();
					service.currentSpecificationChanged.fire(currentSpecification);
				}

				function setNewSpecification(){
					service.clearSpecification();
					currentSpecification.ParentId = angular.copy(item.Id);
					currentSpecification.CompositeItemId = angular.copy(compositeItemId);
					service.currentSpecificationChanged.fire(currentSpecification);
				}

				function isModifiedSpecification(){
					let isModified = false;
					if(modifiedSpecifications.length) {
						let matchedItem = _.find(modifiedSpecifications, {CompositeItemId: compositeItemId, ParentId: item.Id});
						if (matchedItem) {
							isModified = true;
							service.setCurrentSpecification(matchedItem);
						}
						return isModified;
					}
				}

				if(item.ClobsFk){
					if(isModifiedSpecification()){
						return;
					}
					$http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + item.ClobsFk
					}
					).then(function (response) {
						// Load successful
						if (response && response.data) {
							currentSpecification = angular.copy(response.data);
							currentSpecification.ParentId = angular.copy(item.Id);
							currentSpecification.CompositeItemId = angular.copy(compositeItemId);
							service.currentSpecificationChanged.fire(currentSpecification);
						}
					},
					function (/* error */) {
						// Load failed
						service.clearSpecification();
					});
				}else{
					if(isModifiedSpecification()){
						return;
					}
					setNewSpecification();
				}
			};

			/**
		 * @ngdoc function
		 * @name setSpecificationAsModified
		 * @function
		 * @description Register the given specification as modified so it'll be saved on estimate header selection change.
		 * Do some further checks if saving the changes are really necessary.
		 * @param {Object} specification : modified specification that's to be saved
		 */
			service.setSpecificationAsModified = function setSpecificationAsModified(specification) {

				if (!specification) {
					return;
				}

				let currentlySelectedEstHeader = $injector.get('estimateProjectService').getSelected();

				if(modifiedSpecifications.length){
					let matchedItem = _.find(modifiedSpecifications, {ParentId : specification.ParentId});
					if(matchedItem){
						angular.merge(matchedItem, angular.copy(specification));
					}else{
						modifiedSpecifications.push(angular.copy(specification));
					}
				}else{
					modifiedSpecifications.push(angular.copy(specification));
				}

				if(currentlySelectedEstHeader){
					$injector.get('estimateProjectService').markItemAsModified(currentlySelectedEstHeader);
				}
			};

			/**
		 * @ngdoc function
		 * @name getCurrentSpecification
		 * @function
		 * @description This function returns the current specification coming form the currently selected estimate header
		 * @returns {Object} returns object representing the current specification
		 */
			service.getCurrentSpecification = function getCurrentSpecification() {
				return currentSpecification;
			};

			service.getModifiedSpecification = function getModifiedSpecification(){
				if(angular.isDefined(modifiedSpecifications) && modifiedSpecifications.length){
					return modifiedSpecifications;
				}
				else{
					return null;
				}
			};

			service.resetModifiedSpecification = function resetModifiedSpecification(){
				modifiedSpecifications = [];
			};

			return service;
		}]);
})();
