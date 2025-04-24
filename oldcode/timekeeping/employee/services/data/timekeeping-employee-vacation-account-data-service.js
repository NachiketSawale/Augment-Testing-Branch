/**
 * Created by Mohit on 20.06.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeVacationAccountDataService
	 * @description pprovides methods to access, create and update timekeeping time symbol account entities
	 */
	myModule.service('timekeepingEmployeeVacationAccountDataService', TimekeepingEmployeeVacationAccountDataService);

	TimekeepingEmployeeVacationAccountDataService.$inject = ['_','platformDataServiceFactory', 'platformRuntimeDataService', 'timekeepingEmployeeDataService', 'basicsCommonMandatoryProcessor','timekeepingEmployeeConstantValues','platformDataServiceProcessDatesBySchemeExtension'];

	function TimekeepingEmployeeVacationAccountDataService(_,platformDataServiceFactory, platformRuntimeDataService, timekeepingEmployeeDataService, basicsCommonMandatoryProcessor,timekeepingEmployeeConstantValues,platformDataServiceProcessDatesBySchemeExtension ) {
		let self = this;
		let timekeepingTimeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeVacationAccountDataService',
				entityNameTranslationID: 'timekeeping.employee.vacationAccountListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/vacationaccount/',
					endRead: 'vacationlistbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingEmployeeConstantValues.schemes.vacationAccount),
					{ processItem: setReadonly },
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},

				entityRole: {
					leaf: {itemName: 'vacationAccount', parentService: timekeepingEmployeeDataService}
				}
			}
		};
		function setReadonly(entity) {
			platformRuntimeDataService.readonly(entity, entity.IsReadonly);
		}


		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			//validationService: 'timekeepingEmployeeVacationAccountValidationService'
		}, timekeepingEmployeeConstantValues.schemes.vacationAccount));
	}
})(angular);
