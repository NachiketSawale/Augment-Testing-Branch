/**
 * Created by baf on 16.07.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingCrewMemberDataService
	 * @description pprovides methods to access, create and update timekeeping crew member entities
	 */
	myModule.service('timekeepingCrewMemberDataService', TimekeepingCrewMemberDataService);

	TimekeepingCrewMemberDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingCrewConstantValues', 'timekeepingEmployeeDataService'];

	function TimekeepingCrewMemberDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingCrewConstantValues, timekeepingEmployeeDataService) {
		var self = this;
		var timekeepingCrewMemberServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingCrewMemberDataService',
				entityNameTranslationID: 'timekeeping.employee.timekeepingCrewMemberEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/crew/member/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingCrewConstantValues.schemes.member)],
				presenter: {
					list: {
					}
				},
				entityRole: {
					leaf: {itemName: 'CrewMember', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingCrewMemberServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
