/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDefaultDataService
	 * @description pprovides methods to access, create and update timekeeping employee default entities
	 */
	myModule.service('timekeepingEmployeeDefaultDataService', TimekeepingEmployeeDefaultDataService);

	TimekeepingEmployeeDefaultDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'PlatformMessenger',
		'basicsCommonMandatoryProcessor', 'basicsCostGroupAssignmentService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDataService'];

	function TimekeepingEmployeeDefaultDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, PlatformMessenger,
		basicsCommonMandatoryProcessor, basicsCostGroupAssignmentService, timekeepingEmployeeConstantValues, timekeepingEmployeeDataService) {
		var self = this;
		var serviceContainer = null;
		var timekeepingEmployeeDefaultServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeDefaultDataService',
				entityNameTranslationID: 'timekeeping.employee.timekeepingEmployeeDefaultEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'timekeeping/employee/default/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/default/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingEmployeeConstantValues.schemes.employeeDefault)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						incorporateDataRead: function(result, data) {
							data.isDataLoaded = true;

							basicsCostGroupAssignmentService.process(result, self, {
								mainDataName: 'dtos',
								attachDataName: 'EmployeeDefault2CostGroups',
								dataLookupType: 'EmployeeDefault2CostGroups',
								identityGetter: function identityGetter(entity){
									return {
										Id: entity.MainItemId
									};
								}
							});

							return serviceContainer.data.handleReadSucceeded(result.dtos, data);
						}
					}
				},
				entityRole: {
					node: {itemName: 'Defaults', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeDefaultServiceOption, self);
		self.onCostGroupCatalogsLoaded = new PlatformMessenger();
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingEmployeeDefaultValidationService'
		}, timekeepingEmployeeConstantValues.schemes.employeeDefault));
	}
})(angular);
