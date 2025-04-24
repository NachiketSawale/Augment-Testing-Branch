/**
 * Created by baf on 28.05.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeSkillDataService
	 * @description pprovides methods to access, create and update timekeeping employee skill entities
	 */
	myModule.service('timekeepingEmployeeSkillDataService', TimekeepingEmployeeSkillDataService);

	TimekeepingEmployeeSkillDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDataService'];

	function TimekeepingEmployeeSkillDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingEmployeeConstantValues, timekeepingEmployeeDataService) {
		var self = this;
		var timekeepingEmployeeSkillServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeSkillDataService',
				entityNameTranslationID: 'timekeeping.employee.timekeepingEmployeeSkillEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/skill/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingEmployeeConstantValues.schemes.skill)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'Skills', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeSkillServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingEmployeeSkillValidationService'
		}, timekeepingEmployeeConstantValues.schemes.skill));
	}
})(angular);
