/**
 * Created by chd on 29/3/2022.
 */
(function (angular) {
	/* global globals, Platform */

	'use strict';
	let moduleName = 'basics.meeting';

	/**
	 * @ngdoc service
	 * @name basicsMeetingSpecificationService
	 * @function
	 * @description
	 * basicsMeetingSpecificationService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('basicsMeetingSpecificationService', ['$http', 'platformDataServiceFactory', 'basicsMeetingMainService',
		function ($http, platformDataServiceFactory, basicsMeetingMainService) {
			let modifiedSpecification = null;
			let selectedMeetingItemId = null;

			let factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'BlobSpecification', parentService: basicsMeetingMainService}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			let service = serviceContainer.service;

			serviceContainer.data.hasModifications = function hasModifications() {
				return modifiedSpecification !== null;
			};

			// Create and save TextBlobs
			service.provideMinutesChangesToUpdate = function provideMinutesChangesToUpdate(updateData) {
				if (modifiedSpecification) {
					// Because the code ('loadSpecificationById' method) executes asynchronously, the 'updateData.MainItemId' may be not equal to the id of current selected meeting item.
					if (updateData.MainItemId === selectedMeetingItemId) {
						updateData.BlobSpecificationToSave = angular.copy(modifiedSpecification);
						updateData.EntitiesCount += 1;
					}
					clearSpecification();
				}
			};

			service.registerGetModificationCallback = function registerGetModificationCallback(callbackFn) {
				serviceContainer.data.getBlobModificationCallback = callbackFn;
			};

			service.unregisterGetModificationCallback = function unregisterGetModificationCallback() {
				serviceContainer.data.getBlobModificationCallback = null;
			};

			service.currentMinutesChanged = new Platform.Messenger();
			let currentSpecification = {
				Content: null,
				Id: 0,
				Version: 0
			};

			// loadSpecificationById
			let notCurrentSpecification;
			service.loadSpecificationById = function loadSpecificationById(args, data) {
				if (data && data.BasBlobsSpecificationFk) {
					$http(
						{
							method: 'GET',
							url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + data.BasBlobsSpecificationFk
						}
					).then(function (response) {
						// Load successful
						if (response && response.data) {
							let selectedEntity = basicsMeetingMainService.getSelected();
							if (selectedEntity && selectedEntity.BasBlobsSpecificationFk && response.data.Id && selectedEntity.BasBlobsSpecificationFk === response.data.Id) {
								currentSpecification = angular.copy(response.data);
								service.currentMinutesChanged.fire(currentSpecification);
								notCurrentSpecification = true;
							}
						} else {
							service.currentMinutesChanged.fire(null);
						}
					},
					function (/* error */) {
						// Load failed
						clearSpecification();
					});
				} else {
					clearSpecification();
					service.currentMinutesChanged.fire(null);
				}
			};

			let clearSpecification = function clearSpecification() {
				modifiedSpecification = null;
				currentSpecification.Content = null;
				currentSpecification.Id = 0;
				currentSpecification.Version = 0;
			};

			// @param {Object} specification : modified specification that's to be saved
			service.setSpecificationAsModified = function setSpecificationAsModified(specification) {
				modifiedSpecification = specification;
				selectedMeetingItemId = basicsMeetingMainService.getIfSelectedIdElse(null);
			};

			// Value for Service-Update
			service.getModifiedSpecification = function getModifiedSpecification() {
				if (modifiedSpecification !== null) {
					let copy = angular.copy(modifiedSpecification);
					modifiedSpecification = null;
					return copy;
				} else {
					return null;
				}
			};

			/**
			 * @ngdoc function
			 * @name getCurrentSpecification
			 * @function
			 * @description This function returns the current specification coming form the currently selected meeting
			 * @returns {Object} returns object representing the current specification
			 */
			service.getCurrentSpecification = function getCurrentSpecification() {
				service.loadSpecificationById(null, basicsMeetingMainService.getSelected());
				if (notCurrentSpecification !== true) {
					return currentSpecification;
				}
			};

			service.setCurrentSpecification = function setCurrentSpecification(specification) {
				if (currentSpecification !== specification) {
					currentSpecification = specification;
					service.currentMinutesChanged.fire(specification);
				}
			};

			return service;
		}]);
})(angular);

