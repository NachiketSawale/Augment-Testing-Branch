/**
 * Created by baf on 18.07.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeCrewMemberDataService
	 * @description pprovides methods to access, create and update timekeeping employee crewMember entities
	 */
	myModule.service('timekeepingEmployeeCrewMemberDataService', TimekeepingEmployeeCrewMemberDataService);

	TimekeepingEmployeeCrewMemberDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceEntityReadonlyProcessor', 'basicsCommonMandatoryProcessor', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDataService'];

	function TimekeepingEmployeeCrewMemberDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceEntityReadonlyProcessor, basicsCommonMandatoryProcessor, timekeepingEmployeeConstantValues, timekeepingEmployeeDataService) {
		let self = this;
		let timekeepingEmployeeCrewMemberServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeCrewMemberDataService',
				entityNameTranslationID: 'timekeeping.employee.employeeCrewMemberEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employee/crewmember/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingEmployeeConstantValues.schemes.crewMember),
				platformDataServiceEntityReadonlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						incorporateDataRead: function(result, data) {
							let index = 0;
							_.each(result, function(dto){
								dto.IdGen = index++;
							});
							return serviceContainer.data.handleReadSucceeded(result, data);
						}

					}
				},
				entityRole: {
					leaf: {itemName: 'CrewMember', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeCrewMemberServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingEmployeeCrewMemberValidationService'
		}, timekeepingEmployeeConstantValues.schemes.crewMember));
	}
})(angular);
