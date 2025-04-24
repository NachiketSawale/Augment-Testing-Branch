(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name allProjectParkingSpaceObjectUnitDataService
	 * @function
	 *
	 * @description
	 * allProjectParkingSpaceObjectUnitDataService
	 */
	var moduleName= 'object.main';
	var allProjectParkingSpaceObjectUnitModule = angular.module(moduleName);
	allProjectParkingSpaceObjectUnitModule.factory('allProjectParkingSpaceObjectUnitDataService', ['_', 'platformDataServiceFactory','objectMainUnitService', 'objectMainUnitReadonlyProcessor',

		function (_, platformDataServiceFactory, objectMainUnitService, objectMainUnitReadonlyProcessor) {
			var factoryOptions = {
				flatLeafItem: {
					module: allProjectParkingSpaceObjectUnitModule,
					serviceName: 'allProjectParkingSpaceObjectUnitDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'object/main/unit/',
						endRead: 'projectparkingspaces',
						initReadData: function initReadData(readData) {
							var selected = objectMainUnitService.getSelected();
							readData.filter = '?projectId=' + selected.Header.ProjectFk;
						}
					},
					//actions: {delete: true, create: 'flat'},

					entityRole: {
						leaf: {itemName: '', parentService: objectMainUnitService }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.init = function (){};
			serviceContainer.data.doesRequireLoadAlways= true;

			serviceContainer.service.hasUnassignedParkingSpace = function hasUnassignedParkingSpace(){
				var unAssigned = _.find(serviceContainer.data.itemList, function(item) {
					return !item.IsAssignedParkingSpace;
				});

				return !!unAssigned;
			};

			function markAsUValuedParkingSpace(psId, val) {
				var ps = serviceContainer.service.getItemById(psId);
				if(ps)
				{
					ps.IsAssignedParkingSpace = val;
					objectMainUnitReadonlyProcessor.processItem(ps);
				}
			}

			serviceContainer.service.markAsUnassignedParkingSpace = function markAsUnassignedParkingSpace(psId){
				markAsUValuedParkingSpace(psId, false);
			};

			serviceContainer.service.markAsAssignedParkingSpace = function markAsAssignedParkingSpace(psId){
				markAsUValuedParkingSpace(psId, true);
			};

			return serviceContainer.service;

		}]);
})(angular);
