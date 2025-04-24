/**
 * Created by chd on 24.03.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeLicenseCheckDataService
	 * @description pprovides methods to access, create and update timekeeping employee license check entities
	 */
	myModule.service('timekeepingEmployeeLicenseCheckDataService', TimekeepingEmployeeLicenseCheckDataService);

	TimekeepingEmployeeLicenseCheckDataService.$inject = ['_', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor', 'timekeepingEmployeeDataService', 'ServiceDataProcessDatesExtension'];

	function TimekeepingEmployeeLicenseCheckDataService(_, platformDataServiceFactory, basicsCommonMandatoryProcessor, timekeepingEmployeeDataService, ServiceDataProcessDatesExtension) {
		var self = this;
		var timekeepingEmployeeLicenseCheckServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeLicenseCheckDataService',
				entityNameTranslationID: 'timekeeping.employee.licenseCheckListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/licensecheck/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [new ServiceDataProcessDatesExtension(['DateChecked'])],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
					}
				},
				entityRole: {
					leaf: {itemName: 'LicenseChecks', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeLicenseCheckServiceOption, self);

		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EmployeeLicenseCheckDto',
			moduleSubModule: 'Timekeeping.Employee',
			validationService: 'timekeepingEmployeeLicenseCheckValidationService',
			mustValidateFields: ['EmployeeDocumentFk']
		});
	}
})(angular);
