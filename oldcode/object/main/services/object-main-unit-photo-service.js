(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainUnitPhotoService
	 * @function
	 *
	 * @description
	 * objectMainUnitPhotoService is the data service for all Unit Photo related functionality.
	 */
	var moduleName = 'object.main';
	var objectMainUnitPhotoModule = angular.module(moduleName);
	objectMainUnitPhotoModule.factory('objectMainUnitPhotoService', [ 'platformDataServiceFactory', 'objectMainUnitService', 'platformFileUtilServiceFactory', '$rootScope', 'platformModalService',

		function (platformDataServiceFactory, objectMainUnitService, platformFileUtilServiceFactory, $rootScope, platformModalService) {
			var factoryOptions = {
				flatLeafItem: {
					module: objectMainUnitPhotoModule,
					serviceName: 'objectMainUnitPhotoService',
					entityNameTranslationID: 'object.main.entityObjectMainUnitPhoto',
					httpCreate: {route: globals.webApiBaseUrl + 'object/main/unitphoto/', endCreate: 'createphoto'},
					httpRead: {
						route: globals.webApiBaseUrl + 'object/main/unitphoto/',
						usePostForRead: true,
						endRead: 'listByParent',
						initReadData: function initReadData(readData) {
							var selected = objectMainUnitService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = objectMainUnitService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'UnitPhoto', parentService: objectMainUnitService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.createItem = function () {
				var result = {};
				$rootScope.$emit('photoAdded', result);
				if(!result.processed) {
					platformModalService.showMsgBox( 'Open container: "photo view" to add photos',  'Adding photos failed', 'info');
				}
			};

			serviceContainer.service.getSelectedSuperEntity = function getSelectedSuperEntity() {
				return objectMainUnitService.getSelected();
			};

			serviceContainer.service.deleteEntities = function () {
				$rootScope.$emit('photoDeleted', serviceContainer.service.load);
			};

			return serviceContainer.service;
		}]);
})(angular);
