/**
 * Created by Mohit on 30.03.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeCertificationDataService
	 * @description pprovides methods to access, create and update timekeeping certification entities
	 */
	myModule.service('timekeepingEmployeeCertificationDataService', TimekeepingEmployeeCertificationDataService);

	TimekeepingEmployeeCertificationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDataService'];

	function TimekeepingEmployeeCertificationDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingEmployeeConstantValues, timekeepingEmployeeDataService) {
		let self = this;
		let timekeepingEmployeeCertificationOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeCertificationDataService',
				entityNameTranslationID: 'timekeeping.employee.timekeepingEmployeeCertificationList',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/certification/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingEmployeeConstantValues.schemes.certification)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Certification', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeCertificationOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingEmployeeCertificationValidationService'
		}, timekeepingEmployeeConstantValues.schemes.certification));
	}
})(angular);
