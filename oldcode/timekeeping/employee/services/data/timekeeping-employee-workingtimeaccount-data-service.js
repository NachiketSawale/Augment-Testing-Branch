/**
 * Created by shen on 7/6/2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeWorkingTimeAccountVDataService
	 * @description pprovides methods to access, create and update timekeeping employee working time account entities
	 */
	myModule.service('timekeepingEmployeeWorkingTimeAccountVDataService', TimekeepingEmployeeWorkingTimeAccountVDataService);

	TimekeepingEmployeeWorkingTimeAccountVDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDataService'];

	function TimekeepingEmployeeWorkingTimeAccountVDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingEmployeeConstantValues, timekeepingEmployeeDataService) {
		let self = this;
		let serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeWorkingTimeAccountVDataService',
				entityNameTranslationID: 'timekeeping.employee.timekeepingEmployeeWorkingTimeAccountVEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/workingtimeaccount_v/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingEmployeeConstantValues.schemes.workingTimeAccountV)],
				entityRole: {
					node: {itemName: 'WorkingTimeAccountV', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
