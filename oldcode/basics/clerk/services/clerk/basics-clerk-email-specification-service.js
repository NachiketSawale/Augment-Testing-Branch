(function (angular) {
	/* global globals */
	/* global Platform */

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name cloudCommonSpecificationService
	 * @function
	 * @description
	 * cloudCommonSpecificationService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('basicsClerkEmailSpecificationService', ['$http', 'platformDataServiceFactory', 'basicsClerkMainService',
		function ($http, platformDataServiceFactory, basicsClerkMainService) {
			var modifiedSpecification = null;

			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					//httpRead: { route: globals.webApiBaseUrl + 'basics/clerk/clerk/' },
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'EmailFooter', parentService: basicsClerkMainService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			var service = serviceContainer.service;

			serviceContainer.data.hasModifications = function hasModifications() {
				return modifiedSpecification !== null;
			};

			//Create and save TextBlobs
			service.provideEmailFooterChangesToUpdate = function provideEmailFooterChangesToUpdate(updateData) {
				if (modifiedSpecification) {
					updateData.EmailFooterToSave = angular.copy(modifiedSpecification);
					if (!updateData.EntitiesCount) {
						updateData.EntitiesCount = 1;
					} else {
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

			service.currentEmailChanged = new Platform.Messenger();
			var currentSpecification = {
				Content: null,
				Id: 0,
				Version: 0
			};

			//loadSpecificationById
			var notCurrentSpecification;
			service.loadSpecificationById = function loadSpecificationById(args, data) {
				if (data && data.BlobsEmailfooterFk) {
					$http(
						{
							method: 'GET',
							url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + data.BlobsEmailfooterFk
						}
					).then(function (response) {
						// Load successful
						if (response && response.data) {
							currentSpecification = angular.copy(response.data);
							service.currentEmailChanged.fire(currentSpecification);
							notCurrentSpecification = true;
						} else {
							service.currentEmailChanged.fire(null);
						}
					},
					function (/*error*/) {
						// Load failed
						clearSpecification();
					});
				} else {
					clearSpecification();
					service.currentEmailChanged.fire(null);
				}
			};
			var clearSpecification = function clearSpecification() {
				modifiedSpecification = null;
				currentSpecification.Content = null;
				currentSpecification.Id = 0;
				currentSpecification.Version = 0;
			};

			//@param {Object} specification : modified specification that's to be saved
			service.setSpecificationAsModified = function setSpecificationAsModified(specification) {
				modifiedSpecification = specification;
			};
			//Value for Service-Update
			service.getModifiedSpecification = function getModifiedSpecification() {
				//	if(angular.isDefined(modifiedSpecification)){
				if (modifiedSpecification !== null) {
					var copy = angular.copy(modifiedSpecification);
					modifiedSpecification = null;

					return copy;
				} else {
					return null;
				}
			};

			//Current
			/**
			 * @ngdoc function
			 * @name getCurrentSpecification
			 * @function
			 * @description This function returns the current specification coming form the currently selected clerk
			 * @returns {Object} returns object representing the current specification
			 */
			service.getCurrentSpecification = function getCurrentSpecification() {
				service.loadSpecificationById(null, basicsClerkMainService.getSelected());
				if (notCurrentSpecification !== true) {
					return currentSpecification;
				}
			};

			service.setCurrentSpecification = function setCurrentSpecification(specification) {
				if (currentSpecification !== specification) {
					currentSpecification = specification;
					service.currentEmailChanged.fire(specification);
				}
			};

			return service;
		}]);
})(angular);
