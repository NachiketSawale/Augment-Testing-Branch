/**
 * Created by joshi on 21.09.2017.
 */
(function (angular) {

	'use strict';
	/* global globals */

	let moduleName = 'basics.costcodes';
	let basicsCostCodesModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsCostCodes2ResTypeService
	 * @function
	 * @description
	 * basicsCostCodes2ResTypeService is the data service for Costcodes resource type.
	 */
	basicsCostCodesModule.factory('basicsCostCodes2ResTypeService',
		['platformDataServiceFactory', 'basicsCostCodesMainService', function (platformDataServiceFactory, basicsCostCodesMainService) {

			let canCreate = function canCreate() {
				let list = service.getList();
				let sel = basicsCostCodesMainService.getSelected();
				return !!sel && !(list && list.length);
				// return true;
			};

			// The instance of the main service - to be filled with functionality below
			let resourceTypeServiceOption = {
				flatLeafItem: {
					module: basicsCostCodesModule,
					serviceName: 'basicsCostCodes2ResTypeService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/costcodes/restype/', endCreate: 'create' },
					httpRead: {route: globals.webApiBaseUrl + 'basics/costcodes/restype/', endRead: 'list'},
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/costcodes/', endUpdate: 'update'},
					actions: { create: 'flat', canCreateCallBackFunc: canCreate, delete : {} },
					entitySelection: {},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.mainItemId = basicsCostCodesMainService.getIfSelectedIdElse(0);
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {

								return serviceContainer.data.handleReadSucceeded(readItems, data);
							},
							handleCreateSucceeded : function(newData){

								return newData;
							}
						}
					},
					entityRole: { leaf: { itemName: 'CostCodes2ResType', moduleName: 'basics.costcodes',  parentService: basicsCostCodesMainService}}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(resourceTypeServiceOption);

			let service = serviceContainer.service;
			return service;
		}]);
})(angular);